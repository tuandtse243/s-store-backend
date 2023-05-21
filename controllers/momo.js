import express from "express";
import ErrorHandler from '../utils/ErrorHandler.js';
import catchAsyncErrors from '../middlewares/catchAsyncErrors.js';
import { momoPayment } from "../helpers/momoPayment.js";

const router = express.Router();

router.post('/create-payment', catchAsyncErrors(async (req, res, next) => {
    try {
        const infoPayment = req.body;

        const payUrl = await momoPayment();
        res.status(201).json({
            success: true,
            payUrl,
        });
        
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}))

export default router