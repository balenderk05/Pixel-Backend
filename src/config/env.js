import dotenv from "dotenv";

dotenv.config();

const requiredEnvVariables = [
    "MONGODB_URI",
    "JWT_SECRET"
];

for (const variable of requiredEnvVariables) {
    if (!process.env[variable]){
        throw new Error(`Missing required environment variable: ${variable}`);
    }
}
const env = {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || "development",
    mongodbUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "365d",
    razorpay: {
        keyId:process.env.RAZORPAY_KEY_ID,
        keySecret:process.env.RAZORPAY_KEY_SECRET,
        webhookSecret:process.env.RAZORPAY_WEBHOOK_SECRET
    }
};

export default env;