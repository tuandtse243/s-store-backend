import dotenv from 'dotenv'
import app from './app.js';
import connectDB from './config/db.js';

//Handling uncaught Exception
process.on('uncaughtException', (err) => {
    console.log(`Error: ${err.message}`);
    console.log('Shutting down the server for handling uncaught exception');
})

//configure env
dotenv.config()

//database config
connectDB()

//PORT
const PORT = process.env.PORT || 5000;

// run listen
app.listen(PORT, () => {
    console.log(`Server is running on ${process.env.DEV_MODE} mode on http://localhost:${PORT}`.bgCyan.white)
})

// Unhandled promise rejection
process.on('unhandledRejection', (err) => {
    console.log(`Shutting down the server for ${err.message}`);
    console.log(`Shutting down the server for unhandle promise rejection`);

    server.close(() => {
        process.exit(1);
    });
})