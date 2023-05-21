import ErrorHandler from "./middlewares/error.js";
import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import morgan from "morgan";
import dotenv from 'dotenv';
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url';

import user from './controllers/user.js'
import product from './controllers/product.js'
import order from './controllers/order.js'
import momo from './controllers/momo.js'

const app = express();

app.use(express.json())
app.use(morgan('dev'))

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}))

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve(path.dirname(__filename));

app.use("/", express.static(path.join(__dirname,"/uploads")));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

//config
if (process.env.NODE_ENV !== "PRODUCTION") {
    dotenv.config();
}

//import routes
app.use('/api/v2/user', user);
app.use("/api/v2/product", product);
app.use("/api/v2/order", order);
app.use("/api/v2/momo", momo);

//It's for ErrorHandling
app.use(ErrorHandler);

export default app