import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import nodemailer from 'nodemailer';
import User from '../models/user.model.js';
import AdminInvite from '../models/adminInvite.model.js'; 
import { protect, admin } from '../middleware/authMiddleware.js';
import { storage } from '../config/cloudinary.js';

const router = Router();
const upload = multer({ storage });

// === ROUTE: Register (UPDATED LOGIC with Invite Code) ===
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, inviteCode } = req.body;
        if (!name || !email || !password) return res.status(400).json({ msg: "Please enter all fields." });

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ msg: "An account with this email already exists." });

        let role = 'customer'; // By default, role customer hoga

        // Agar user ne invite code diya hai
        if (inviteCode) {
            const invite = await AdminInvite.findOne({ token: inviteCode, status: 'active' });
            // Agar code ghalat ya istemal shuda hai
            if (!invite) {
                return res.status(400).json({ msg: "Invalid or expired admin invite code." });
            }
            // Agar code theek hai, to role admin set karein
            role = 'admin';
            // Code ko istemal shuda (used) mark kar dein
            invite.status = 'used';
            await invite.save();
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({ name, email, password: hashedPassword, role });
        await newUser.save();
        res.status(201).json({ msg: "User registered successfully!" });

    } catch (err) {
        console.error("Register Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// Invite Code Generate Karna admin ke liye 
router.post('/generate-invite', protect, admin, async (req, res) => {
    try {
        const newInvite = new AdminInvite();
        await newInvite.save();
        res.status(201).json({ msg: "New invite code generated. It will expire in 24 hours.", invite: newInvite });
    } catch (err) {
        console.error("Generate Invite Error:", err);
        res.status(500).json({ error: 'Server error while generating invite code.' });
    }
});

//Login Admin aur Customer
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ msg: "Please enter all fields." });

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "Invalid credentials." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.json({
            token,
            user: {
                id: user._id, name: user.name, email: user.email,
                role: user.role, profilePicture: user.profilePicture
            }
        });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// Profile Update 
router.put('/profile', protect, upload.single('profilePicture'), async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user) {
            user.name = req.body.name || user.name;
            if (req.file) {
                user.profilePicture = req.file.path;
            }
            const updatedUser = await user.save();
            const token = jwt.sign({ id: updatedUser._id, role: updatedUser.role }, process.env.JWT_SECRET, { expiresIn: '30d' });
            res.json({
                token,
                user: {
                    id: updatedUser._id, name: updatedUser.name, email: updatedUser.email,
                    role: updatedUser.role, profilePicture: updatedUser.profilePicture
                }
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error("Profile Update Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// Forgot Password 
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ msg: "If an account with that email exists, a reset link has been sent." });
        }
        const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '10m' });
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        const transporter = nodemailer.createTransport({
            service: 'gmail', auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS, },
        });

        const mailOptions = {
            to: user.email, from: `Let's Go <${process.env.EMAIL_USER}>`,
            subject: 'Password Reset Request',
            html: `<p>You requested a password reset. Click this <a href="${resetUrl}">link</a> to set a new password. This link will expire in 10 minutes.</p>`
        };
        await transporter.sendMail(mailOptions);
        res.json({ msg: "A password reset link has been sent to your email." });
    } catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Reset Password 
router.post('/reset-password/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) return res.status(401).json({ msg: 'Invalid or expired token.' });
        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ msg: 'User not found.' });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        res.json({ msg: 'Password has been reset successfully. You can now login.' });
    } catch (error) {
        console.error("Reset Password Error:", error);
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({ msg: 'Invalid or expired token.' });
        }
        res.status(500).json({ msg: 'Server error' });
    }
});

export default router;