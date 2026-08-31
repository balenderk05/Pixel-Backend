import express from "express";
import orderController from "../order/order.controller.js";

import validate from "../../middleware/validate.middleware.js";

import { registerAdminSchema, loginAdminSchema } from "./admin.validation.js";

import { register, login } from "./admin.controller.js";
import authenticateAdmin from "../../middleware/auth.middleware.js";
// import { getOrdersQuerySchema } from "../order/order.validation.js";

const router = express.Router();

router.post("/register", validate(registerAdminSchema), register);

router.post("/login", validate(loginAdminSchema), login);

router.get("/orders", authenticateAdmin, orderController.getOrders);

router.get("/orders/:id", authenticateAdmin, orderController.getOrderById);

export default router;
