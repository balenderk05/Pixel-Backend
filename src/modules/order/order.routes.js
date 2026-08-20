import express from "express";

import orderController from "./order.controller.js";
import validate from "../../middleware/validate.middleware.js";

import {
    createOrderSchema
} from "./order.validation.js";

const router = express.Router();

router.post(
    "/",
    validate(createOrderSchema),
    orderController.createOrder
);

export default router;