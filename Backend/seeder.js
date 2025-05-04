const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");
const User = require("./models/User");
const Cart = require("./models/Cart");
const products = require("./data/products");
const Order = require("./models/Order");

dotenv.config();

// connect to Database
mongoose.connect(process.env.MONGO_URI);

// Function to seed Data

const seedData = async () => {
  try {
    // clear existing data
    await Product.deleteMany();
    await User.deleteMany();
    await Cart.deleteMany();
    await Order.deleteMany();

    // Create a default admin User

    const createdUser = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "123456",
      role: "admin",
    });

    // Assign the default user Id to each product
    const userId = createdUser._id;
    const sampleProducts = products.map((product) => {
      return { ...product, user: userId };
    });

    await Product.insertMany(sampleProducts);
    console.log("Product Data Seedeed Successfuly");
    process.exit();
  } catch (error) {
    console.log("Error seeding the data", error);
    process.exit(1);
  }
};
seedData();
