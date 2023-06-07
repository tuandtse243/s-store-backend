import express from "express";
import User from "../models/user.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import path from 'path'
import jwt from 'jsonwebtoken';
import sendMail from "../utils/sendMail.js";
import catchAsyncError from '../middlewares/catchAsyncErrors.js'
import sendToken from "../utils/jwtToken.js";
import { isAuthenticated } from "../middlewares/auth.js";
import uploadCloud from "../config/cloudinary.js";

const router = express.Router();

// router.post('/create-user', upload.single('file'), async (req, res, next) => {
router.post('/create-user', async (req, res, next) => {
    try {
        const { name, username, password, phone, email} = req.body

        const checkUsername = await User.findOne({username});
        if(checkUsername) {
            return next(new ErrorHandler('Username already exists', 400))
        }
        const checkEmail = await User.findOne({email});
        if(checkEmail) {
            return next(new ErrorHandler('Email already exists', 400))
        }

        // const filename = req.file.filename;
        // const fileUrl = path.join(filename);
        // const avatar = fileUrl;

        const user = {
            name: name,
            username: username,
            password: password,
            phone: phone,
            email: email,
        };        

        const activationToken = createActivationToken(user);

        const activationUrl = `http://localhost:3000/activation/${activationToken}`

        try {
            await sendMail({
                email: user.email,
                subject: "Activation your account",
                message: `Hello ${user.name}, please click on the link to activate your account: ${activationUrl}`,

            })
            res.status(201).json({
                success: true,
                message: `Please check your email: ${user.email} to activate your account!`
            })
        } catch (error) {
            return next(new ErrorHandler(err.message, 500))
        }

    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
})

// create activation token
const createActivationToken = (user) => {
    return jwt.sign(user, process.env.ACTIVATION_SECRET, {
      expiresIn: "5m",
    });
};

// activate user
router.post('/activation', catchAsyncError(async (req, res, next) => {
    try {
        const { activation_token } = req.body;

        // console.log(activation_token)

        const newUser = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);

        if(!newUser) {
            return next(new ErrorHandler("Invalid token", 400));
        }
        const {name, email, password, phone, username} = newUser;

        const checkUsername = await User.findOne({username});
        if(checkUsername) {
            return next(new ErrorHandler('Username already exists', 400))
        }
        const checkEmail = await User.findOne({email});
        if(checkEmail) {
            return next(new ErrorHandler('Email already exists', 400))
        }

        const user = await User.create({
            name: name,
            username: username,
            password: password,
            phone: phone,
            email: email,
        });

        sendToken(user, 201, res)
        
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}))

// login user
router.post('/login-user', catchAsyncError(async (req, res, next) => {
    try {
        const {username, password} = req.body;

        if(!username || !password) {
            return next(new ErrorHandler('Please provide the all fields!', 400));
        }
        const user = await User.findOne({username}).select('+password');
        
        if(!user) {
            return next(new ErrorHandler("User doesn't exists!", 400));
        }
        const isPasswordValid = await user.comparePassword(password);

        if(!isPasswordValid) {
            return next(new ErrorHandler("Please provide the correct information", 400));
        }
        sendToken(user, 201, res)
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}));

// load user
router.get('/getuser', isAuthenticated, catchAsyncError(async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if(!user) {
            return next(new ErrorHandler("User doesn't exists", 400));
        }

        res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}))

// log out user
router.get('/logout', isAuthenticated, catchAsyncError(async (req, res, next) => {
    try {
        // res.cookie('token', null, {
        //     expires: new Date(Date.now()),
        //     httpOnly: true,
        // });

        res.status(201).json({
            success: true,
            message: 'Log out successful!'
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}))

// update-avatar
router.post('/update-avatar', uploadCloud.single('image'), catchAsyncError(async (req, res, next) => {
    try {
        if (!req.file) {
            return next(new ErrorHandler('Cập nhật hình thất bại', 400));
        } else {
            const id = req.body.id;

            // trả về user trước khi update
            const newUser = await User.findOneAndUpdate({"_id": id}, {avatar: req.file.path})

            res.status(201).json({
                success: true,
                secure_url: req.file.path,
            })
        }
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}))

// get all users
router.get('/get-all-users', catchAsyncError(async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json({
            success: true,
            users
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}))

// update user
router.put('/update-user', catchAsyncError(async (req, res, next) => {
    try {
        const user = req.body;

        const newUser = await User.findOneAndUpdate({"_id": user._id}, {name: user.name, phone: user.phone, email: user.email, role: user.role});

        res.status(200).json({
            success: true
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}))

// delete user
router.delete('/delete-user', catchAsyncError(async (req, res, next) => {
    try {
        const id = req.query.id;
        const user = await User.findByIdAndDelete(id);
        res.status(200).json({
            success: true
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}))

export default router