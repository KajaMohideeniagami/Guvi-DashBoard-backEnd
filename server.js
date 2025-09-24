const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const queryRoutes = require('./routes/queryRoutes');
const leaveRoutes = require('./routes/leaveRoutes');

dotenv.config();
console.log("MONGO_URI from .env:", process.env.MONGO_URI); // Debug log
connectDB();

const app = express();
app.use(express.json());

// 🔹 Fix CORS Issue
app.use(cors({
  origin: '*', // Allow all frontend origins (change in production)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Use auth routes (for authentication) and query routes (for queries)
app.use('/api', authRoutes);
app.use('/api', queryRoutes);  // Add this line to use the query routes
app.use('/api', leaveRoutes);


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
