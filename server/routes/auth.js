const express = require('express');
const router = express.Router(); // This line was missing!
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- SIGNUP ROUTE ---
router.post('/signup', async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        const lowerEmail = email.toLowerCase().trim();

        let user = await User.findOne({ email: lowerEmail });
        if (user) return res.status(400).json({ message: "User already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            fullName,
            email: lowerEmail,
            password: hashedPassword
        });

        await user.save();
        res.status(201).json({ message: "User created successfully!" });

    } catch (err) {
        res.status(500).json({ message: "Server error during signup" });
    }
});

// --- LOGIN ROUTE ---
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const lowerEmail = email.toLowerCase().trim();

        const user = await User.findOne({ email: lowerEmail });
        if (!user) {
            return res.status(400).json({ message: "Invalid Email or Password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Email or Password" });
        }

        // CREATE A REAL JWT TOKEN
        const token = jwt.sign(
            { id: user._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '30d' }
        );

        res.status(200).json({ 
            message: "Login successful",
            token, 
            user: { id: user._id, fullName: user.fullName } 
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error during login" });
    }
});

module.exports = router;