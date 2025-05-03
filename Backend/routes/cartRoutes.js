const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Helper Function to get a cart by the userId or guestId

const getCart = async (userId, guestId) => {
  if (userId) {
    return await Cart.findOne({ user: userId });
  } else if (guestId) {
    return await Cart.findOne({ guestId });
  } else {
    return null;
  }
};
//@route POST /api/cart
// desc Add a product to the cart for a guest or logged in user
//access Public

router.post("/", async (req, res) => {
  const { productId, quantity, size, color, guestId, userId } = req.body;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product Not Found" });
    }
    // Determin if the user is logged in or guest
    let cart = await getCart(userId, guestId);

    // If the Cart exists , update it

    if (cart) {
      const productIndex = cart.products.findIndex(
        (p) =>
          p.productId.toString() === productId &&
          p.size === size &&
          p.color === color
      );

      if (productIndex > -1) {
        // If the product already exists ,update the quantity

        cart.products[productIndex].quantity += quantity;
      } else {
        cart.products.push({
          productId,
          name: product.name,
          image: product.images[0]?.url || "",
          price: product.price,
          size,
          color,
          quantity,
        });
      }

      // Recalculate the total price
      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      await cart.save();

      return res.status(200).json(cart);
    } else {
      // create a new cart for the guest or user

      const newCart = await Cart.create({
        user: userId ? userId : undefined,
        guestId: guestId ? guestId : "guest_" + new Date().getTime(),
        products: [
          {
            productId,
            name: product.name,
            image: product.images[0]?.url || "",
            price: product.price,
            size,
            color,
            quantity,
          },
        ],
        totalPrice: product.price * quantity,
      });
      return res.status(201).json(newCart);
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).send("Server Error", error);
  }
});

// @route PUT /api/cart
// @desc Update Product quantity in the cart for a guest or logged in user
// @access Public

router.put("/", async (req, res) => {
  const { productId, quantity, size, color, guestId, userId } = req.body;

  try {
    let cart = await getCart(userId, guestId);

    if (!cart) return res.status(404).json({ message: "Cart not found" });
    const productIndex = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color
    );
    if (productIndex > -1) {
      // update Quantity
      if (quantity > 0) {
        cart.products[productIndex].quantity = quantity;
      } else {
        cart.products.splice(productIndex, 1); //Remove the product if the quantity is zero
      }
      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      await cart.save();
      return res.status(200).json(cart);
    } else {
      return res.status(404).json({ message: "Product not fount in Cart" });
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).send("Server Error", error);
  }
});

// route DELETE /api/cart
// @desc Remove a product from the cart
// @access Public

router.delete("/", async (req, res) => {
  const { productId, size, color, userId, guestId } = req.body;
  try {
    let cart = await getCart(userId, guestId);
    if (!cart) {
      return res.status(404).json({ message: "Cart not Found" });
    }

    const productIndex = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.size == size &&
        p.color === color
    );

    if (productIndex > -1) {
      cart.products.splice(productIndex, 1);
      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      await cart.save();
      return res.status(200).json(cart);
    } else {
      return res.status(400).json({ message: "Product not found in the cart" });
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).send("Server Error", error);
  }
});

// @route GET /api/cart
// desc GET logged-in user's or guest's user cart
// access Public

router.get("/", async (req, res) => {
  const { userId, guestId } = req.query;
  try {
    const cart = await getCart(userId, guestId);
    if (cart) {
      res.status(200).json(cart);
    } else {
      res.status(400).json({ message: "Cart not found" });
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).send("Server Error", error);
  }
});

// route POST /api/cart/merge
// @desc Merge guest cart into user Cart on login

router.post("/merge", protect, async (req, res) => {
  const { guestId } = req.body;
  const guestCart = await Cart.findOne({ guestId });
  const userCart = await Cart.findOne({ user: req.user._id });
  try {
    if (guestCart) {
      if (guestCart.products.length === 0) {
        return res.status(400).json({ message: "guest cart is empty" });
      }
      if (userCart) {
        // Merge guest cart into user cart
        guestCart.products.forEach((guestItem) => {
          const productIndex = userCart.products.findIndex((item) => {
            item.productId.toString() === guestItem.productId.toString() &&
              item.size === guestItem.size &&
              item.color === guestItem.color;
          });
          if (productIndex > -1) {
            userCart.products[productIndex].quantity += guestItem.quantity;
          } else {
            userCart.products.push(guestItem);
          }
        });
        userCart.totalPrice = userCart.products.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );

        await userCart.save();
        // remove the guest cart after merging

        try {
          await Cart.findOneAndDelete({ guestId });
        } catch (error) {
          console.log("Error Delete Guest cart:", error);
        }
        res.status(200).json(userCart);
      } else {
        // if the user has no existing cart,assign the guest cart to the user
        guestCart.user = req.user._id;
        guestCart.guestId = undefined;
        await guestCart.save();
        res.status(200).json(guestCart);
      }
    } else {
      if (userCart) {
        return res.status(200).json(userCart);
      }
      res.status(404).json({ message: "Guest cart not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
