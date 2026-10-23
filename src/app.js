import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
app.use(cors(
    {
        origin: process.env.CORS_ORIGIN, 
        credentials: true, // Allow credentials (cookies) to be sent
    }
))

app.use(express.json({limit:"16kb"}))

app.use(express.urlencoded({ extended: true, limit:"16kb" }) )

app.use(express.static('public'))

app.use(cookieParser())

// export default app; -- also we can use this way to export the app instance, but we can also use named export as below
export { app };