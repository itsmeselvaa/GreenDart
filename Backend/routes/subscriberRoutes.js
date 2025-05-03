const express = require("express");
const Subscriber = require("../models/Subscriber");
const router = express.Router();

// @route POST /api/subscribe
// desc Handle newsletter subscription
// access Public

router.post("/subscribe", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is Required" });
  }
  try {
    // Check if the email is already Subscribed

    let subscriber = await Subscriber.findOne({ email });
    if (subscriber) {
      return res.status(400).json({ message: "Email is already Subscribed" });
    }
    // Create a new Subscriber

    subscriber = new Subscriber({ email });
    await subscriber.save();
    res.status(201).json({
      message: "Successfully Subscribed to the news Letter",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
