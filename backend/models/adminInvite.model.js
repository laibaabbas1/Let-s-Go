
import mongoose from 'mongoose';
import crypto from 'crypto';

const adminInviteSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true,
        default: () => crypto.randomBytes(20).toString('hex'), // Automatic unique token deta h
    },
    status: {
        type: String,
        enum: ['active', 'used'],
        default: 'active',
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '24h', // Token 24 ghante mein expire ho jaayega
    },
});

const AdminInvite = mongoose.model('AdminInvite', adminInviteSchema);
export default AdminInvite;