const express = require('express');
const router = express.Router();
const User = require('../models/UserModel');

// REGISTER route
router.post('/register', async (req, res) => {
    const { fullName, username, email, password, phoneNo } = req.body;

    // Check if username or email already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
        return res.status(400).json({ message: 'User with this email or username already exists' });
    }
    console.log(username);
    const newUser = new User({
        fullName,
        username,
        email,
        password,  // Storing plain password
        phoneNo
    });

    try {
        const savedUser = await newUser.save();
        res.status(201).json({ message: 'User registered successfully', userId: savedUser._id });
    } catch (err) {
        // console.log(err)
        res.status(400).json({ message: err.message });
    }
});

// LOGIN route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Find user by username and check password
    const user = await User.findOne({ username });
    if (!user || user.password !== password) {
        return res.status(400).json({ message: 'Invalid username or password' });
    }

    res.json({ message: 'Login successful', userId: user._id });
});

// UPDATE BIO and PROFILE PICTURE route
router.put('/updateProfile', async (req, res) => {
    const { userId, bio, profilePicture } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }    

        // Update bio and profile picture
        if (bio) user.bio = bio;
        if (profilePicture) user.profilePicture = profilePicture;

        const updatedUser = await user.save();
        res.json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get user profile by userId
router.get('/profile/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
