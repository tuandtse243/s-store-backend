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
        const { cart, shippingAddress, user, totalPrice, paymentInfo, discountPrice, shippingFee } = req.body;

        const order = await Order.create({
            cart,
            shippingAddress,
            user,
            totalPrice,
            discountPrice,
            shippingFee,
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

// update payment in order by Id
router.post('/update-order', catchAsyncErrors(async (req, res, next) => {
  try {
    const order = req.body;
    const newOrder = await Order.findOneAndUpdate({"_id": order._id}, {paymentInfo: order.paymentInfo, status: order.status, shippingAddress: order.shippingAddress})
    // console.log(newOrder)

    res.status(201).json({
      success: true,
      newOrder,
    })
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

// all orders --- for admin
router.get(
  "/admin-all-orders",
  // isAuthenticated,
  // isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const orders = await Order.find().sort({
        deliveredAt: -1,
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

export default router