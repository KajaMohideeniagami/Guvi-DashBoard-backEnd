const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

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

app.use('/api', authRoutes);

const PORT = process.env.PORT || 5001;  // ✅ Declare `PORT` only once
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
