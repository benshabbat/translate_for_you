import express, { Application, Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from '../src/routes/auth';
import wordRoutes from '../src/routes/words';
import translateRoutes from '../src/routes/translate';

// Load environment variables
dotenv.config();

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/words', wordRoutes);
app.use('/api/translate', translateRoutes);

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running on Vercel',
    environment: {
      hasMongoURI: !!process.env.MONGODB_URI,
      hasJWTSecret: !!process.env.JWT_SECRET,
      nodeEnv: process.env.NODE_ENV,
      mongooseConnection: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    },
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({ 
    message: 'Translate For You API',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      words: '/api/words',
      translate: '/api/translate'
    }
  });
});

// MongoDB connection
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log('Using existing MongoDB connection');
    return;
  }

  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(mongoURI);
    isConnected = true;
    console.log('✅ Connected to MongoDB successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    isConnected = false;
    throw error;
  }
};

// Vercel serverless function handler
export default async (req: any, res: any) => {
  try {
    console.log('📥 Incoming request:', req.method, req.url);
    console.log('🔑 Environment check:', {
      hasMongoURI: !!process.env.MONGODB_URI,
      hasJWTSecret: !!process.env.JWT_SECRET,
      nodeEnv: process.env.NODE_ENV
    });
    
    await connectDB();
    console.log('✅ MongoDB connected, processing request');
    return app(req, res);
  } catch (error) {
    console.error('❌ Serverless function error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error details:', errorMessage);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: errorMessage,
      timestamp: new Date().toISOString()
    });
  }
};
