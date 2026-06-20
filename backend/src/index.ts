import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from '../routes/auth';
import userRoutes from '../routes/users';
import courseRoutes from '../routes/courses';
import jobRoutes from '../routes/jobs';
import applicationRoutes from '../routes/applications';

const app = express();
const PORT = process.env.PORT || 5000;

// Standard Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
const uploadsPath = path.resolve(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: err.message || 'Something went wrong on the server.' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Relaunch Her Backend running on http://localhost:${PORT}`);
  console.log(`📁 Uploads served statically at http://localhost:${PORT}/uploads`);
});

// backend/index.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false  // Required for Supabase
  }
});

// Test connection on startup
pool.query('SELECT NOW()', (err, res) => {
  if (err) console.error('❌ DB Error:', err);
  else console.log('✅ Connected to Supabase!');
});