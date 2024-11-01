const User = require('../models/User');
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
      const { username, email, password } = req.body;

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
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' }); // Set cookie

      res.status(201).json({ message: 'User registered successfully!', user });
    } catch (error) {
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
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token and set cookie
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' }); // Set cookie

    res.json({ message: 'Login successful', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
