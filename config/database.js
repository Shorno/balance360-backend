import mongoose from 'mongoose';
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`🌿 MongoDB Connected: ${conn.connection.host}`);
        const collections = await conn.connection.db.listCollections().toArray();
        console.log("Available collections:", collections.map(collection => collection.name));

    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;