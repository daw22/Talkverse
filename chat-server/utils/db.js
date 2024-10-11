import crypto from 'crypto';
import mongoose from 'mongoose';

export async function connectDB() {
    await mongoose.connect(process.env.DB_URI);

    console.log('DB connected!');
}