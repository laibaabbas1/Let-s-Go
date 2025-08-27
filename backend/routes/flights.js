import { Router } from 'express';
import multer from 'multer';
import { storage } from '../config/cloudinary.js';
import Flight from '../models/flight.model.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = Router();
const upload = multer({ storage });

// 1: Nayi Flight Add Karna
router.post('/add', protect, admin, upload.single('airlineLogo'), async (req, res) => {
    try {
        const { flightNumber, airline, origin, destination, departureTime, arrivalTime, travelClasses } = req.body;
        const airlineLogoUrl = req.file ? req.file.path : '';
        const newFlight = new Flight({
            flightNumber, airline, airlineLogo: airlineLogoUrl,
            origin, destination, departureTime, arrivalTime,
            travelClasses: JSON.parse(travelClasses)
        });
        await newFlight.save();
        res.status(201).json({ message: 'Flight added successfully!' });
    } catch (error) {
        console.error("Error adding flight:", error);
        res.status(400).json({ message: 'Error: ' + error.message });
    }
});

// 2: Flights Search Karna
router.get('/search', async (req, res) => {
    try {
        const { origin, destination, passengers, travelClass, date } = req.query;

        if (!origin || !destination) {
            return res.status(400).json({ message: 'Origin and destination are required.' });
        }

        const numPassengers = parseInt(passengers) || 1;

        //  MUKAMMAL SEARCH QUERY 
        const query = {
            origin: { $regex: new RegExp(`^${origin}$`, 'i') },
            destination: { $regex: new RegExp(`^${destination}$`, 'i') },
            travelClasses: {
                $elemMatch: {
                    className: travelClass,
                    seatsAvailable: { $gte: numPassengers }
                }
            }
        };

        // Agar user ne date select kia hai, to sirf us din ki flights dikhayein
        if (date) {
            const searchDate = new Date(date);
            const startOfDay = new Date(searchDate.setHours(0, 0, 0, 0));
            const endOfDay = new Date(searchDate.setHours(23, 59, 59, 999));
            query.departureTime = { $gte: startOfDay, $lt: endOfDay };
        } 
        // Agar user ne date select nahi ki, to aaj se aage ki saari flights dikhayein
        else {
            query.departureTime = { $gte: new Date() };
        }

        const flights = await Flight.find(query);
        res.json(flights);
    } catch (error) {
        console.error("Error searching flights:", error);
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
});

// 3: Admin ke liye saari flights fetch karn
router.get('/', protect, admin, async (req, res) => {
    try {
        const flights = await Flight.aggregate([
            {
                $lookup: {
                    from: 'bookings',
                    localField: '_id',
                    foreignField: 'flight',
                    as: 'bookings'
                }
            },
            {
                $addFields: {
                    totalSeats: { $sum: '$bookings.passengers' }, 
                    bookedSeats: { $sum: '$bookings.passengers' }
                }
            },
            {
                $project: { bookings: 0 }
            }
        ]);
        res.json(flights);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch flights data for admin." });
    }
});

export default router;