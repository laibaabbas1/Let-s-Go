import express from 'express';
import {
    processPayment,
    sendStripeApiKey,
    updateBookingStatusAfterPayment
} from '../controllers/paymentController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

//  sirf logged-in user hi in routes ko access kar sakta hai.
router.route('/payment/process').post(protect, processPayment);
// API key 
router.route('/stripeapikey').get(protect, sendStripeApiKey);
//to update booking
router.route('/booking/status/update').put(protect, updateBookingStatusAfterPayment);

export default router;