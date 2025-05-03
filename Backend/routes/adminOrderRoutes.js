const express = require("express");
const { protect, admin } = require("../middleware/authMiddleware");
const Order = require("../models/Order");
const router = express.Router();

// @route GET /api/admin/orders
// @desc Get all Orders(admin only)

router.get("/", protect, admin, async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email");
    return res.json(orders);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
});

// @route PUT /api/admin/orders/:id
// @desc Update order status
// access Private/admin

router.put("/:id", protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name");
    const { status } = req.body;
    if (!order) {
      return res.status(404).json({ message: "Order not Found" });
    }
    order.status = status;
    order.isDelivered = status === "Delivered" ? true : false;
    order.deliveredAt = status === "Delivered" ? Date.now() : null;
    const updatedOrder = await order.save();
    return res.json(updatedOrder);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
});

// @route DELETE /api/admin/orders/:id
// @desc Delete an order
// access Private/Admin

router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not Exists" });
    }
    await order.deleteOne();
    return res.json({ message: "Order Deleted Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
});
module.exports = router;
