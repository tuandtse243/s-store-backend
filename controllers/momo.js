import express from "express";
import ErrorHandler from '../utils/ErrorHandler.js';
import catchAsyncErrors from '../middlewares/catchAsyncErrors.js';
import { momoPayment } from "../helpers/momoPayment.js";
import Order from "../models/order.js";

const router = express.Router();

router.post('/create-payment', catchAsyncErrors(async (req, res, next) => {
    try {
        const payUrl = await momoPayment();

        // const { cart, shippingAddress, user, totalPrice, paymentInfo } = req.body;
        const order = req.body

        const newOrder = await Order.findOneAndUpdate({"_id": order._id}, {paymentInfo: order.paymentInfo})

        res.status(201).json({
            success: true,
            payUrl,
            newOrder,
        });
        
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}))

export default router