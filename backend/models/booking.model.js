import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const bookingSchema = new Schema({
    flight: { type: Schema.Types.ObjectId, ref: 'Flight', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    bookingDate: { type: Date, default: Date.now },
    priceAtBooking: { type: Number, required: true },
    passengers: { type: Number, required: true, default: 1 },
    travelClass: { type: String, required: true, enum: ['Economy', 'Business', 'First'] },

    paymentInfo: {
        id: { type: String },
        status: { type: String, default: 'pending' }
    },

    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Canceled'],
        default: 'Pending' // Nayi booking ab 'Pending' hogi
    }
}, {
    timestamps: true
});

const Booking = model('Booking', bookingSchema);

export default Booking;