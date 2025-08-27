import { Router } from 'express';
import Booking from '../models/booking.model.js';
import Flight from '../models/flight.model.js';
import { protect, admin } from '../middleware/authMiddleware.js';

import stripePackage from 'stripe';
const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);

const router = Router();

//  1: Nayi Booking Karna
router.post('/create', protect, async (req, res) => {
    try {
        const { flightId, passengers, travelClass } = req.body;
        const userId = req.user.id;
        const flight = await Flight.findById(flightId);
        if (!flight) return res.status(404).json({ success: false, message: "Flight not found" });

        const selectedClass = flight.travelClasses.find(tc => tc.className === travelClass);
        if (!selectedClass) {
            return res.status(404).json({ success: false, message: "Travel class not found on this flight." });
        }
        if (selectedClass.seatsAvailable < passengers) {
            return res.status(400).json({ success: false, message: `Not enough seats available in ${travelClass} class.` });
        }

        const priceAtBooking = selectedClass.price * passengers;
        const newBooking = new Booking({
            flight: flightId,
            user: userId,
            priceAtBooking: priceAtBooking,
            passengers: passengers,
            travelClass: travelClass,
            status: 'Pending'
        });

        const savedBooking = await newBooking.save();
        res.status(201).json({
            success: true,
            message: "Booking initiated successfully!",
            booking: savedBooking
        });

    } catch (error) {
        console.error("Create Booking Error:", error);
        res.status(500).json({ success: false, message: "Server error while initiating booking." });
    }
});

//2: User ki Apni Bookings Dikhana 
router.get('/mybookings', protect, async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id }).populate('flight').sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        console.error("My Bookings Error:", error);
        res.status(500).json({ message: "Server error fetching your bookings." });
    }
});

//  3: User ke liye Booking Cancel Karna 
router.put('/cancel/:id', protect, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        if (booking.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }
        if (booking.status === 'Confirmed') {
            const flight = await Flight.findById(booking.flight);
            if (flight) {
                const selectedClass = flight.travelClasses.find(tc => tc.className === booking.travelClass);
                if (selectedClass) {
                    selectedClass.seatsAvailable += booking.passengers;
                    await flight.save();
                }
            }
        }
        booking.status = 'Canceled';
        await booking.save();
        res.json({ message: 'Booking canceled successfully', booking });
    } catch (error) {
        console.error("Cancel Booking Error:", error);
        res.status(500).json({ message: 'Server error while canceling booking.' });
    }
});

//  4: Tamam Bookings Dikhana (Admin) 
router.get('/', protect, admin, async (req, res) => {
    try {
        const bookings = await Booking.find({}).populate('user', 'name email').populate('flight').sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        console.error("Admin Get Bookings Error:", error);
        res.status(500).json({ message: "Server error fetching bookings for admin." });
    }
});

// 5: Booking ka Status Update Karna (Admin) 
router.put('/update-status/:id', protect, admin, async (req, res) => {
    try {
        const { status: newStatus } = req.body;
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        const flight = await Flight.findById(booking.flight);
        if (flight) {
            const selectedClass = flight.travelClasses.find(tc => tc.className === booking.travelClass);
            if (selectedClass) {
                if (booking.status === 'Confirmed' && newStatus === 'Canceled') {
                    selectedClass.seatsAvailable += booking.passengers;
                }
                else if (booking.status === 'Canceled' && newStatus === 'Confirmed') {
                    if (selectedClass.seatsAvailable < booking.passengers) {
                        return res.status(400).json({ message: 'Cannot confirm, not enough seats.' });
                    }
                    selectedClass.seatsAvailable -= booking.passengers;
                }
                await flight.save();
            }
        }
        booking.status = newStatus;
        const updatedBooking = await booking.save();
        res.json({ message: 'Booking status updated successfully', booking: updatedBooking });
    } catch (error) {
        console.error("Admin Update Status Error:", error);
        res.status(500).json({ message: 'Server error updating status.' });
    }
});


// 6: User ke liye Booking Edit Karna Refund ke logic ke saat
router.put('/edit/:id', protect, async (req, res) => {
    try {
        const { newPassengers, newTravelClass } = req.body;
        const booking = await Booking.findById(req.params.id);

        if (!booking) return res.status(404).json({ message: 'Booking not found.' });
        if (booking.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized.' });
        if (booking.status === 'Canceled') return res.status(400).json({ message: 'Cannot edit a canceled booking.' });

        const flight = await Flight.findById(booking.flight);
        if (!flight) return res.status(404).json({ message: 'Associated flight not found.' });

        const originalClass = flight.travelClasses.find(tc => tc.className === booking.travelClass);
        if (originalClass) {
            originalClass.seatsAvailable += booking.passengers;
        }

        const newClass = flight.travelClasses.find(tc => tc.className === newTravelClass);
        if (!newClass) {
            if (originalClass) originalClass.seatsAvailable -= booking.passengers; // Rollback
            return res.status(404).json({ message: 'New travel class not found.' });
        }
        if (newClass.seatsAvailable < newPassengers) {
            if (originalClass) originalClass.seatsAvailable -= booking.passengers; // Rollback
            return res.status(400).json({ message: `Not enough seats in ${newTravelClass}.` });
        }
        newClass.seatsAvailable -= newPassengers;

        const newPrice = newClass.price * newPassengers;
        const priceDifference = newPrice - booking.priceAtBooking;
        let responseMessage = 'Booking updated successfully!';

        if (priceDifference < 0) {
            const refundAmount = Math.abs(priceDifference);
            const originalPaymentIntentId = booking.paymentInfo.id;

            if (originalPaymentIntentId) {
                await stripe.refunds.create({
                    payment_intent: originalPaymentIntentId,
                    amount: Math.round(refundAmount * 100),
                });
                responseMessage = `Booking updated! A refund of PKR ${refundAmount.toLocaleString()} has been initiated.`;
            }
        }

        booking.passengers = newPassengers;
        booking.travelClass = newTravelClass;
        booking.priceAtBooking = newPrice;

        await flight.save();
        await booking.save();

        res.json({ message: responseMessage, booking });

    } catch (error) {
        console.error("Edit Booking Error:", error);
        res.status(500).json({ message: 'Server error while editing booking.' });
    }
});

// 7: Edit se pehle Price ka Difference Calculate Karna
router.post('/recalculate-edit/:id', protect, async (req, res) => {
    try {
        const { newPassengers, newTravelClass } = req.body;
        const booking = await Booking.findById(req.params.id).populate('flight');

        if (!booking || booking.status !== 'Confirmed') {
            return res.status(400).json({ message: "This booking cannot be recalculated." });
        }

        const newClass = booking.flight.travelClasses.find(tc => tc.className === newTravelClass);
        if (!newClass) return res.status(404).json({ message: 'New travel class not found.' });

        const newPrice = newClass.price * newPassengers;
        const priceDifference = newPrice - booking.priceAtBooking;

        res.json({ priceDifference });

    } catch (error) {
        console.error("Recalculate Error:", error);
        res.status(500).json({ message: 'Server error during recalculation.' });
    }
});

export default router;