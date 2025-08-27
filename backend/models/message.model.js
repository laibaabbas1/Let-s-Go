import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const messageSchema = new Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
}, {
    timestamps: true
});

const Message = model('Message', messageSchema);

export default Message;