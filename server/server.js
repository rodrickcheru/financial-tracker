require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
console.log("Connecting to:", process.env.MONGO_URI); 

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Successfully connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// --- API ROUTES ---

// 1. Auth Routes (Login/Signup)
app.use('/api/auth', require('./routes/auth'));

// 2. Transaction Routes (Income/Expense)
// This links to your routes.js file which uses the incomeController
app.use('/api/v1', require('./routes/routes')); 

// Base Test Route
app.get('/', (req, res) => {
  res.send("Finance Tracker API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is flying on port ${PORT}`);
});