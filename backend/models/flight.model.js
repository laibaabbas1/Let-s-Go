import mongoose from "mongoose";
const { Schema, model } = mongoose;

// Travel Class ke liye schema
const classSchema = new Schema(
    {
        className: {
            type: String,
            required: true,
            enum: ["Economy", "Business", "First"],
        },
        price: {
            type: Number,
            required: true,
        },
        seatsAvailable: {
            type: Number,
            required: true,
        },
    },
    { _id: false }
); // Is chotay schema ki apni _id nahi hogi

const flightSchema = new Schema(
    {
        flightNumber: {
            type: String,
            required: true,
            unique: true,
        },
        airline: {
            type: String,
            required: true,
        },
        airlineLogo: { type: String },
        origin: {
            type: String,
            required: true
        },
        destination: {
            type: String,
            required: true
        },
        departureTime: {
            type: Date,
            required: true
        },
        arrivalTime: {
            type: Date,
            required: true
        },

        travelClasses: [classSchema],
    },
    {
        timestamps: true,
    }
);

const Flight = model("Flight", flightSchema);
export default Flight;
