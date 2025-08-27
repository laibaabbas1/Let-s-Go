import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/user.model.js';
import flightsRouter from './routes/flights.js';
import usersRouter from './routes/users.js';
import messagesRouter from './routes/messages.js';
import bookingsRouter from './routes/bookings.js';
import paymentRouter from './routes/payment.js';
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json()); // Body parser

// MongoDB Connection
const uri = process.env.MONGO_URI;
mongoose.connect(uri);

const connection = mongoose.connection;
connection.once('open', async () => {
    console.log("MongoDB database connection established successfully");

    // ADMIN CREATION LOGIC
    try {
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        const adminExists = await User.findOne({ email: adminEmail });

        if (!adminExists) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(adminPassword, salt);

            const adminUser = new User({
                name: 'Admin',
                email: adminEmail,
                password: hashedPassword,
                role: 'admin'
            });

            await adminUser.save();
            console.log('Admin user created successfully!');
        } else {
            console.log('Admin user already exists.');
        }
    } catch (error) {
        console.error('Error ensuring admin user exists:', error);
    }
    //ADMIN LOGIC END
});

// API Routes
app.use('/flights', flightsRouter);
app.use('/api/users', usersRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/bookings', bookingsRouter);

app.use('/api/v1', paymentRouter);

// Basic Route
app.get('/', (req, res) => {
    res.send('Flight Booking API is running...');
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});