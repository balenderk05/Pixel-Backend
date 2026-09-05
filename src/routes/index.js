import express from "express";
import productRoute from "../modules/product/product.routes.js";
import adminRoutes from "../modules/admin/admin.routes.js";
import orderRoutes from "../modules/order/order.routes.js";
import notificationRoutes from "../modules/notification/notification.routes.js";

const router = express.Router();

router.get("/health", (req, res) => {
  res.status(200).json({ message: "API is healthy" });
});

router.use("/products", productRoute);
router.use("/admin/auth", adminRoutes);
router.use("/orders", orderRoutes);
router.use("/admin/notifications", notificationRoutes);
export default router;
