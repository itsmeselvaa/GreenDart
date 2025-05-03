const express = require("express");
const User = require("../models/User");
const { protect, admin } = require("../middleware/authMiddleware");
const router = express.Router();

// @route GET /api/admin/user
// desc GET all Users(Admin Only)
// access Private/Admin

router.get("/users", protect, admin, async (req, res) => {
  try {
    const users = await User.find();
    return res.json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
});

// @route /api/admin/users
// desc add a new User(Admin only)
// @access Private/Admin

router.post("/", protect, admin, async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User Already Exists" });
    }

    user = new User({
      name,
      email,
      password,
      role: role || "customer",
    });
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route PUT /api/admin/users/:id
// desc Update user info(admin  only) = Name,email,role
// access Private/admin

router.put("/:id", protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { name, role } = req.body;
    if (user) {
      user.name = name || user.name;
      user.role = role || user.role;
    }
    const updatedUser = await user.save();
    res.json({ message: "User updated Successfully", user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// router DELETE /api/admin/users/:id
// desc delete a User
// access private/admin

router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      await user.deleteOne();
      res.json({ message: "User Deleted Succesfully" });
    } else {
      return res.status(404).json({ message: "User not Exists" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
