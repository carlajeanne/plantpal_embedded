import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { mainDB } from './server/config/db.js';

// Import your routes
import authRoutes from './server/routes/auth.js';
import userRoutes from './server/routes/user.js';
import dashboardRoutes from './server/routes/dashboard.js';

dotenv.config();

// Initialize Express App
const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);


// Database Initialization and Server Start
const startServer = async () => {
  let mainDBConnection;

  try {
    // Initialize Main Database
    mainDBConnection = await mainDB();

    // Define API Routes (using mainDB)
    app.use('/api/auth', authRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/dashboard', dashboardRoutes);

    // Start Server
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  } finally {
    if (mainDBConnection) mainDBConnection.end();
  }
};

startServer();
