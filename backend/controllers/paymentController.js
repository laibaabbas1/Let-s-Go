import stripePackage from 'stripe';
import Booking from '../models/booking.model.js';
import Flight from '../models/flight.model.js'; // Flight model ko import karna zaroori hai

const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);

//  Payment Intent Create Karna 
export const processPayment = async (req, res) => {
    try {
        const { amount, bookingId } = req.body;
        if (!bookingId) {
            return res.status(400).json({ success: false, message: "Booking ID is required" });
        }

        const amountInPaisa = Math.round(amount * 100);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInPaisa,
            currency: "pkr",
            metadata: { bookingId: bookingId },
        });

        await Booking.findByIdAndUpdate(bookingId, {
            'paymentInfo.id': paymentIntent.id,
            'paymentInfo.status': 'processing'
        });

        res.status(200).json({
            success: true,
            client_secret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error("Process Payment Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

//  Frontend ko Publishable Key Bhejna 
export const sendStripeApiKey = async (req, res) => {
    res.status(200).json({ stripeApiKey: process.env.STRIPE_PUBLISHABLE_KEY });
};

// Payment ke baad Booking ko Update Karna
export const updateBookingStatusAfterPayment = async (req, res) => {
    try {
        const { bookingId, paymentIntentId, editData } = req.body; // editData ab yahan aayega

        //  Payment ko Stripe se verify karein
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        if (paymentIntent.status !== 'succeeded') {
            return res.status(400).json({ success: false, message: `Payment not successful. Status: ${paymentIntent.status}` });
        }

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        //check krna nai booking h edit
        if (editData) {
            //YEH EK EDIT HAI
            const { newPassengers, newTravelClass } = editData;
            const flight = await Flight.findById(booking.flight);
            if (!flight) return res.status(404).json({ message: 'Associated flight not found.' });

            // Seat management (purane /edit route se liya gaya)
            const originalClass = flight.travelClasses.find(tc => tc.className === booking.travelClass);
            if (originalClass) originalClass.seatsAvailable += booking.passengers;

            const newClass = flight.travelClasses.find(tc => tc.className === newTravelClass);
            if (!newClass || newClass.seatsAvailable < newPassengers) {
                if (originalClass) originalClass.seatsAvailable -= booking.passengers; 
                return res.status(400).json({ message: 'Not enough seats for the updated booking.' });
            }
            newClass.seatsAvailable -= newPassengers;

            // Ab booking update ki
            booking.passengers = newPassengers;
            booking.travelClass = newTravelClass;
            booking.priceAtBooking += paymentIntent.amount / 100; // Purani price mein extra amount add kana
            booking.paymentInfo.id = paymentIntent.id; // Nayi payment ID use ho ge
            booking.paymentInfo.status = 'succeeded';

            await flight.save();
            await booking.save();

        } else {
            //YEH EK NAYI BOOKING HAI
            const flight = await Flight.findById(booking.flight);
            if (flight) {
                const selectedClass = flight.travelClasses.find(tc => tc.className === booking.travelClass);
                if (selectedClass && selectedClass.seatsAvailable >= booking.passengers) {
                    selectedClass.seatsAvailable -= booking.passengers; // Ab yahan seats minus hongi
                    await flight.save();
                } else {
                    // Agar seats nahi hain, to foran refund kar dein
                    await stripe.refunds.create({ payment_intent: paymentIntentId });
                    booking.status = 'Canceled'; // Booking ko foran cancel krna
                    await booking.save();
                    return res.status(400).json({ success: false, message: 'Seats became unavailable just before payment. Your payment has been refunded.' });
                }
            }
            booking.paymentInfo.status = 'succeeded';
            booking.status = 'Confirmed';
            await booking.save();
        }

        res.status(200).json({ success: true, booking });

    } catch (error) {
        console.error("Update Booking Status Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};