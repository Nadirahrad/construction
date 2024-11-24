require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
// other imports and middleware here

const app = express();

// Database connection
/*mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
   .then(() => console.log("Connected to MongoDB"))
   .catch((error) => console.error("MongoDB connection error:", error));*/
   mongoose.connect(process.env.MONGODB_URI)
   .then(() => console.log("Connected to MongoDB"))
   .catch((error) => console.error("MongoDB connection error:", error));

// Middleware
app.use(express.json());

// Your routes here
app.use('/contractors', require('./routes/contractorRoutes'));

// Export the app without listening
module.exports = app;
