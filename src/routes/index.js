import express from "express";
import productRoute from "../modules/product/product.routes.js"


const router = express.Router();

router.get("/health", (req, res) => {
    res.status(200).json({message: "API is healthy"})
});

router.use("/products", productRoute)

export default router;