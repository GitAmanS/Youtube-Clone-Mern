const mongoose = require('mongoose');
require('dotenv').config();

console.log("Mongo URI:", process.env.MONGO_URI); // Log the URI for debugging

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully!');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1); // Exit the process with failure
  }
};

module.exports = connectDB;
