import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from "cookie-parser";
import morgan from 'morgan';


import connectDB from "./config/database.js";
import userRoutes from "./routes/userRoutes.js"
import trainerRoutes from "./routes/trainerRoutes.js"
import adminRoutes from "./routes/adminRoutes.js";
import classRoutes from "./routes/classRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import newsLetterRoutes from "./routes/newsLetterRoutes.js";
import forumRoutes from "./routes/forumRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";

const app = express();

connectDB();


app.use(cors({
    origin: ["http://localhost:5173", "https://balance360.vercel.app"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser())


app.get('/', (req, res) => {
    res.send('Hello, this api server for Fit Fam Project');
})



app.use('/api/users', userRoutes);
app.use('/api/trainers', trainerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/classes', classRoutes);
app.use("/api/payments", paymentRoutes)
app.use("/api/newsletter", newsLetterRoutes)
app.use("/api/forum", forumRoutes)
app.use("/api/reviews", reviewRoutes)
app.use("/api/public", publicRoutes)


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});