import { Router } from 'express';
import Message from '../models/message.model.js'; // Aakhir mein .js add karein
import nodemailer from 'nodemailer';

const router = Router();

// URL: POST /api/messages/send
router.post('/send', async (req, res) => {
    try {
        const { fullName, email, message } = req.body;

        // 1. Database mein message save kana
        const newMessage = new Message({ fullName, email, message });
        await newMessage.save();

        // 2. Email bhejne ka setup
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `Let's Go <${process.env.EMAIL_USER}>`, // Bhejne wale ka naam bhi set kia
            to: process.env.EMAIL_USER,
            subject: `New Message from Let's Go Website`, 
            html: `
                <h3>You have a new contact message!</h3>
                <p><strong>Name:</strong> ${fullName}</p>
                <p><strong>Email:</strong> ${email}</p>
                <hr>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `
        };

        // 3. Email bhejnaaa
        await transporter.sendMail(mailOptions);

        res.status(200).json({ success: true, msg: 'Message sent and saved!' });

    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ success: false, msg: 'Failed to send message.' });
    }
});

export default router;