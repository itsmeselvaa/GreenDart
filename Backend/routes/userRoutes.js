const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// @route POST /api/user/register
//@desc Register a new User
// @access Public

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User Already Exists" });
    }
    // Create a new user
    user = new User({
      name,
      email,
      password,
    });

    // Save user to database
    await user.save();

    // Create JWT payload
    const payload = {
      user: { id: user._id, role: user.role, email: user.email },
    };

    // Sign and return the token
    jwt.sign(
      payload,
      process.env.JWT_SECRET, // Ensure JWT_SECRET is in your .env file
      { expiresIn: "40h" }, // Adjust expiration time if needed
      (err, token) => {
        if (err) {
          throw err;
        }
        // Send user data and token in response
        res.json({
          success: true,
          message: "User Logined successfully",

          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token,
        });
      }
    );
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).send("Registration Server Errors");
  }
});

// @route POST /api/users/login
// desc authenticate user Public
//access Public

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials" });
    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials" });

    const payload = {
      user: { id: user._id, role: user.role },
    };

    // Sign and return the token
    jwt.sign(
      payload,
      process.env.JWT_SECRET, // Ensure JWT_SECRET is in your .env file
      { expiresIn: "40h" }, // Adjust expiration time if needed
      (err, token) => {
        if (err) {
          throw err;
        }
        // Send user data and token in response
        res.json({
          success: true,
          message: "User Logined successfully",

          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token,
        });
      }
    );
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).send("Lgin Server Errors");
  }
});

// @route GET /api/user/profile
// desc Get logged-in user's Profile (Protected Route)
// @access private

router.get("/profile", protect, async (req, res) => {
  res.json(req.user);
});

module.exports = router;
