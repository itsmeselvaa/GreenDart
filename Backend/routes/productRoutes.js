const express = require("express");
const Product = require("../models/Product");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

//route POST /api/products
//desc Create a new Products
//@access Private/Admin

router.post("/", protect, admin, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      sku,
    } = req.body;

    const product = new Product({
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      sku,
      user: req.user._id,
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

// @route PUT /api/products/:id
// @desc update an existing product Id
// @access Private/Admin

router.put("/:id", protect, admin, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      sku,
    } = req.body;
    // Finde product by ID

    const product = await Product.findById(req.params.id);
    if (product) {
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price || product.price;
      product.discountPrice = discountPrice || product.discountPrice;
      product.countInStock = countInStock || product.countInStock;
      product.category = category || product.category;
      product.brand = brand || product.brand;
      product.sizes = sizes || product.sizes;
      product.colors = colors || product.colors;
      product.collections = collections || product.collections;
      product.material = material || product.material;
      product.gender = gender || product.gender;
      product.images = images || product.images;
      product.isFeatured =
        isFeatured !== undefined ? isFeatured : product.isFeatured;
      product.isPublished =
        isPublished !== undefined ? isPublished : product.isPublished;
      product.tags = tags || product.tags;
      product.dimensions = dimensions || product.dimensions;
      product.weight = weight || product.weight;
      product.sku = sku || product.sku;
      // save the updated product to the database
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not Found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", error });
  }
});

// @route Delete /api/products/:id
// @desc delte a product by id
// @access Private/admin

router.delete("/:id", protect, admin, async (req, res) => {
  try {
    // Find the product by Id
    const product = await Product.findById(req.params.id);
    if (product) {
      // Remove it from the database
      await product.deleteOne();
      res.json({ message: "Product Delete Succesfully" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error", error);
  }
});

// @route GET /api/products
// @desc Get all products with optional query Filters
// @access Public

router.get("/", async (req, res) => {
  try {
    console.log("📥 Incoming query:", req.query);

    const {
      collection,
      sizes,
      color,
      gender,
      minPrice,
      maxPrice,
      sortBy,
      search,
      category,
      material,
      brand,
      limit,
    } = req.query;

    let query = {};

    // Collection filter
    if (collection && collection.toLowerCase() !== "all") {
      query.collection = collection;
    }

    if (category && category.toLowerCase() !== "all") {
      query.category = category;
    }

    if (material) {
      query.material = { $in: material.split(",") };
    }

    if (brand) {
      query.brand = { $in: brand.split(",") };
    }

    if (sizes) {
      query.sizes = { $in: sizes.split(",") };
    }

    if (color) {
      query.colors = { $in: [color] }; // ensure it's correct field name
    }

    if (gender) {
      query.gender = gender;
    }

    // ✅ Price Filter Fix
    const min = Number(minPrice);
    const max = Number(maxPrice);
    if (!isNaN(min) || !isNaN(max)) {
      query.price = {};
      if (!isNaN(min)) query.price.$gte = min;
      if (!isNaN(max)) query.price.$lte = max;
      console.log("💰 Price filter applied:", query.price);
    }

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Sorting logic
    let sort = {};
    if (sortBy) {
      switch (sortBy) {
        case "priceAsc":
          sort = { price: 1 };
          break;
        case "priceDesc":
          sort = { price: -1 };
          break;
        case "popularity":
          sort = { rating: -1 };
          break;
      }
    }

    // Fetch products
    const products = await Product.find(query)
      .sort(sort)
      .limit(Number(limit) || 0);

    res.json(products);
  } catch (error) {
    console.error("🔴 Error fetching products:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @route GET /api/products/best-seller
//desc Retrieve the products with highes rating
// @access Public

router.get("/best-seller", async (req, res) => {
  try {
    const bestSeller = await Product.findOne().sort({ rating: -1 });
    if (bestSeller) {
      res.json(bestSeller);
    } else {
      res.status(400).json({ message: "BestSeller Product Not found" });
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).send("Server Error", error);
  }
});

// @route GET /api/products/new-arrivals
// desc Retrieve latest 8 Products - creation date
// Access Public

router.get("/new-arrivals", async (req, res) => {
  try {
    const newArrivals = await Product.find().sort({ createAt: -1 }).limit(8);
    if (newArrivals) {
      res.json(newArrivals);
    } else {
      res.status(400).json({ message: "NewArrivals Product Not found" });
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).send("Server Error", error);
  }
});

// @route GET /api/products/:id
// desc Get a Single Product by Id
// @access Public

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not Found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", error });
  }
});

// route GET /api/products/similar/:id
// @desc Retrieve similar products based on the current category
//access public

router.get("/similar/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      res.status(404).json({ message: "Product not Found" });
    }
    const similarProducts = await Product.find({
      _id: { $ne: id }, //Exclude the current product Id
      gender: product.gender,
      category: product.category,
    }).limit(4);

    res.json(similarProducts);
  } catch (error) {
    console.log("Similar Product Getting Error");
    res.status(500).json("Server Error", error);
  }
});

module.exports = router;
