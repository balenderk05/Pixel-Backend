import express from "express";
import productRoute from "../modules/product/product.routes.js"
import adminRoutes from "../modules/admin/admin.routes.js";


const router = express.Router();

router.get("/health", (req, res) => {
    res.status(200).json({message: "API is healthy"})
});

router.use("/products", productRoute)
router.use("/admin/auth", adminRoutes);

export default router;