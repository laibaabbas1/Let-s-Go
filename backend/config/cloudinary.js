import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Image storage ki settings
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'flight_logos', // Cloudinary par is folder mein images save hon gi
        allowed_formats: ['jpg', 'png', 'jpeg'],
    },
});

export {
    cloudinary,
    storage,
};