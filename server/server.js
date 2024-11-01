const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db'); // Import the connectDB function
const userRoutes = require('./routes/userRoutes');
const channelRoutes = require('./routes/channelRoutes')
const cookieParser = require('cookie-parser');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(cookieParser());

// Database Connection
connectDB(); // Call the connectDB function

// Routes
app.use('/api/users', userRoutes); // User-related routes
app.use('/api', channelRoutes)

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
