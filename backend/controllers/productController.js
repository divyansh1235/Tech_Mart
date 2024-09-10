import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js";
import dotenv from "dotenv";
dotenv.config();

import redis from "redis";

const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
});
// redisClient.connect();
redisClient.connect();
redisClient.on("error", (err) => console.log("Redis error: ", err.message));
redisClient.on("connect", () => console.log("Connected to redis server"));

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 12;
  const page = Number(req.query.pageNumber) || 1;

  const keyWord = req.query.keyWord
    ? { name: { $regex: req.query.keyWord, $options: "i" } }
    : {};

  let keyForCache =
    String(page) + "#" + String(req.query.keyWord ? req.query.keyWord : "");

  let cachedData = await redisClient.get(keyForCache);

  if (cachedData) {
    // console.log("present");
    res.json(JSON.parse(cachedData));
  } else {
    // console.log("not present");
    const count = await Product.countDocuments({ ...keyWord });
    const products = await Product.find({ ...keyWord })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    const responseData = { products, page, pages: Math.ceil(count / pageSize) };
    await redisClient.set(keyForCache, JSON.stringify(responseData), {
      EX: 120,
    });

    res.json(responseData);
  }
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    return res.json(product);
  }
  res.status(404);
  throw new Error("Resource not found");
});

// @desc    Create products
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: " ",
    price: 0,
    user: req.user._id,
    image: "/images/sample.jpg",
    brand: " ",
    category: " ",
    countInStock: 0,
    numReviews: 0,
    description: " ",
  });
  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    base64String,
    brand,
    category,
    countInStock,
  } = req.body;
  const product = await Product.findById(req.params.id);
  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = base64String === "" ? product.image : base64String;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Resource not found");
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.status(200).json({
      message: "Product deleted",
    });
  } else {
    res.status(404);
    throw new Error("Resource not found");
  }
});

// @desc    Create a new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Product already reviewed");
    }

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment: comment,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, review) => acc + review.rating, 0) /
      product.reviews.length;
    product.save();
    res.status(201).json({ massage: "Review added" });
  } else {
    res.status(404);
    throw new Error("Resource not found");
  }
});

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
};
