import mongoose from "mongoose";
import env from './env.js';

const connectDatabase = async () => {
    try {
        await mongoose.connect(env.mongodbUri);
        console.log("MongoDb connected successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        console.error(error.message);


        process.exit(1);
    }
}

export default connectDatabase;