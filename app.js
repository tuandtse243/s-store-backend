import ErrorHandler from "./middlewares/error.js";
import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import morgan from "morgan";
import dotenv from 'dotenv';
import cors from 'cors'

import user from './controllers/user.js'

const app = express();

app.use(express.json())
app.use(morgan('dev'))

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}))
app.use('/', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

//config
if (process.env.NODE_ENV !== "PRODUCTION") {
    dotenv.config();
}

//import routes
app.use('/api/v2/user', user);

//It's for ErrorHandling
app.use(ErrorHandler);

export default app