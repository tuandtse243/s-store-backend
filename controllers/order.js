import express from 'express';
import ErrorHandler from '../utils/ErrorHandler.js';
import catchAsyncErrors from '../middlewares/catchAsyncErrors.js';
import { isAuthenticated } from '../middlewares/auth.js'
import Order from '../models/order.js';
import Product from '../models/product.js';

const router = express.Router();

//create new order
router.post('/create-order', catchAsyncErrors(async (req, res, next) => {
    try {
        const { cart, shippingAddress, user, totalPrice, paymentInfo } = req.body;

        const order = await Order.create({
            cart: cart,
            shippingAddress,
            user,
            totalPrice,
            paymentInfo,
        });

        res.status(201).json({
            success: true,
            order,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}))

// get all orders of an user
router.get(
    "/get-all-orders/:userId",
    catchAsyncErrors(async (req, res, next) => {
      try {
        const orders = await Order.find({ "user._id": req.params.userId }).sort({
          createdAt: -1,
        });
  
        res.status(200).json({
          success: true,
          orders,
        });
      } catch (error) {
        return next(new ErrorHandler(error.message, 500));
      }
    })
  );

export default router