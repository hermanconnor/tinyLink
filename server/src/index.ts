import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import 'express-async-errors';

import dbConnect from './config/db.js';
import corsOptions from './config/corsOptions.js';
import errorHandler from './middleware/errorHandler.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import urlRoutes from './routes/urlRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// CONNECT TO DATABASE
dbConnect();

// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(morgan('dev'));

// ROUTES
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/urls', urlRoutes);

// GLOBAL ERROR HANDLER
app.use(errorHandler);

// START SERVER
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
});

// HANDLE DB ERROR
mongoose.connection.on('error', (err) => {
  console.error(err);
  process.exit(1);
});

// HANDLE UNCAUGHT REJECTION
process.on('unhandledRejection', (reason, p) => {
  console.error(`Unhandled Rejection at: ${p}, Reason: ${reason}`);
  process.exit(1);
});

// HANDLE UNCAUGHT EXCEPTION
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception', err);
  process.exit(1);
});
