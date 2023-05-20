import express from "express";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import fs from 'fs'
import Product from "../models/product.js";
import upload from '../utils/multer.js';

const router = express.Router();

// create product
router.post(
    "/create-product",
    upload.array("images"),
    catchAsyncErrors(async (req, res, next) => {
      try {
        const files = req.files;
        const imageUrls = files.map((file) => `${file.filename}`);
        const productData = req.body;
        productData.images = imageUrls;

        const product = await Product.create(productData);
        console.log(product)

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
        return next(new ErrorHandler(error, 400));
      }
    })
);

export default router