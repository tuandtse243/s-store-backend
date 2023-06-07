import ErrorHandler from "../utils/ErrorHandler.js";
import catchAsyncErrors from "./catchAsyncErrors.js";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const isAuthenticated = catchAsyncErrors(async(req, res, next) => {
    const token = req.header("Authorization");
    if(!token) {
        return next(new ErrorHandler("Hãy đăng nhập để tiếp tục!", 401));
    };

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    req.user = user;

    next();
});

export const isUser = catchAsyncErrors(async(req, res, next) => {
    const token = req.header("Authorization");
    if(!token) {
        return next(new ErrorHandler("Hãy đăng nhập để tiếp tục!", 401));
    };

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if(user.role === 'user' || user.role === "supporter") {
        req.user = user;
        next();
    } else {
        return next(new ErrorHandler("Hãy đăng nhập để tiếp tục!", 401));
    }
});

export const isSupporter = catchAsyncErrors(async(req, res, next) => {
    const token = req.header("Authorization");
    if(!token) {
        return next(new ErrorHandler("Hãy đăng nhập để tiếp tục!", 401));
    };

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if(user.role === "supporter") {
        req.user = user;
        next();
    } else {
        return next(new ErrorHandler("Bạn không đủ thẩm quyền để truy cập!", 401));
    }
});

