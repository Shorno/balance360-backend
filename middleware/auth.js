import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        console.log(token);
        if (!token) {
            return res.status(401).json({ message: "Access token not found. Please login." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userEmail = decoded.user;

        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};