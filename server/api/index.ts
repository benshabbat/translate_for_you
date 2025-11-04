import { VercelRequest, VercelResponse } from '@vercel/node';
import mongoose from 'mongoose';
import app from '../../src/server';

let isConnected = false;

async function connectDB() {
  if (isConnected) {
    return;
  }

  const mongoUri = process.env.MONGODB_URI || '';
  await mongoose.connect(mongoUri);
  isConnected = true;
  console.log('✅ Connected to MongoDB');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await connectDB();
  return app(req, res);
}
