const User = require('../models/User');
const {Channel} = require('../models/Channel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { bucket } = require('../config/firebase');
const multer = require('multer');

// Configure multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// User Registration
exports.registerUser = async (req, res) => {
  upload.single('avatar')(req, res, async () => {
    try {
      console.log("this being hit")
      const { username, email, password } = req.body;

      // Check if the user already exists
      const existingUser = await User.findOne({ $or: [{ username }, { email }] });
      if (existingUser) {
        console.log("user already exists")
        return res.status(400).json({ message: 'User already exists, please login.' });
      }

      // Handle avatar upload
      let avatarUrl = null;
      if (req.file) {
        const blob = bucket.file(`avatars/${username}-${Date.now()}.png`);
        await blob.save(req.file.buffer, {
          metadata: { contentType: req.file.mimetype },
        });

        // Make the file publicly accessible
        await blob.makePublic();

        avatarUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ username, email, password: hashedPassword, avatar: avatarUrl });
      await user.save();

      // Generate token and set cookie
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
      res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' }); // Set cookie

      console.log("registered successfully")
      res.status(201).json({ message: 'User registered successfully!', user });
    } catch (error) {
      console.log("error:", error)
      res.status(500).json({ message: error.message });
    }
  });
};


// Edit User Name or Avatar
exports.editUser = async (req, res) => {
  upload.single('avatar')(req, res, async () => {
    try {
      console.log("req.user:", req.user);
      const userId = req.user.id; // Assuming user ID is set in req.user
      const { username } = req.body;

      const updateData = {};
      if (username) {
        updateData.username = username;
      }

      // Handle avatar upload
      if (req.file) {
        const blob = bucket.file(`avatars/${username}-${Date.now()}.png`);
        await blob.save(req.file.buffer, {
          metadata: { contentType: req.file.mimetype },
        });

        // Make the file publicly accessible
        await blob.makePublic();

        updateData.avatar = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      }

      const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      console.log("reg success")
      res.status(200).json({ message: 'User updated successfully!', user });

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
};

// User Login
exports.loginUser = async (req, res) => {
  console.log("login hit:", req.body);
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      console.log("user not found")
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("incorrect pass")
      return res.status(401).json({ message: 'Invalid Password' });
    }

    // Generate token and set cookie
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' }); // Set cookie

    res.json({ message: 'Login successful', user });
    console.log("login success")
  } catch (error) {
    console.log("error", error)
    res.status(500).json({ message: error.message });
  }
};


exports.getUser = async(req, res)=>{
  try{
    const userId = req.user.id;
    const user = await User.findById(userId);

    if(!user){
      res.status(404).json({message:"user not found"});
    }
    res.status(200).json({message:"user found successfully", user})
  }catch(error){
    res.status(500).json({message:"internal server error"});
  }

}

exports.getChannel = async (req, res) => {
  try {
    // Check if req.user exists before trying to access user data
    let channelId = null;
    
    if (req.user) {
      // If req.user exists, set channelId from user.channels[0]
      const user = await User.findById(req.user.id);
      channelId = user?.channels?.[0] || null; // If user doesn't have any channels, channelId will be null
    }

    // If channelId exists in the query, use it
    if (req.query.channelId) {
      channelId = req.query.channelId;
    }

    // If no channelId was set, return an error
    if (!channelId) {
      return res.status(400).json({ message: "Channel ID is missing" });
    }

    // Fetch the channel by the provided channelId
    const channel = await Channel.findById(channelId);

    // If the channel is not found, return a 404 error
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    // If everything is successful, return the channel data
    res.status(200).json({ message: "Channel found successfully", channel });
    
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is set in req.user

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


