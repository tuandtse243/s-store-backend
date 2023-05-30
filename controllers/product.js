import express from "express";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import fs from 'fs'
import Product from "../models/product.js";
import upload from '../utils/multer.js';
import uploadCloud from "../config/cloudinary.js";

const router = express.Router();

// create product
router.post(
    "/create-product",
    uploadCloud.array("images"),
    catchAsyncErrors(async (req, res, next) => {
      try {
        const files = req.files;

        const imageUrls = files.map((file) => `${file.path}`);
        const productData = req.body;
        productData.images = imageUrls;

        productData.sizes = productData.sizes.split(',')

        const product = await Product.create(productData);
        // console.log(product)

        res.status(201).json({
            success: true,
            product: product,
        });
      } catch (error) {
        return next(new ErrorHandler(error, 400));
      }
    })
);

// get all products
router.get(
    "/get-all-products",
    catchAsyncErrors(async (req, res, next) => {
      try {
        const products = await Product.find().sort({ createdAt: -1 });
  
        res.status(201).json({
          success: true,
          products,
        });
      } catch (error) {
        return next(new ErrorHandler(error, 500));
      }
    })
);

// get product by id
router.get('/get-product-by-id', catchAsyncErrors(async (req, res, next) => {
  try {
    const id = req.query.id
    const product = await Product.findById(id);
    
    res.status(201).json({
      success: true,
      product
    })
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
}))

// get product by category
router.get('/get-product-by-category', catchAsyncErrors(async (req, res, next) => {
  try {
    const category = req.query.category
    const products = await Product.find({category: category});

    res.status(201).json({
      success: true,
      products
    })
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
}))

export default router