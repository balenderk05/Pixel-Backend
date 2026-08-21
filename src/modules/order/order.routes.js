import express from "express";

import orderController from "./order.controller.js";
import validate from "../../middleware/validate.middleware.js";

import { createOrderSchema, verifyPaymentSchema } from "./order.validation.js";

const router = express.Router();

router.post("/", validate(createOrderSchema), orderController.createOrder);

router.post("/:id/payment", orderController.createPaymentOrder);

router.post(
  "/:id/payment/verify",
  validate(verifyPaymentSchema),
  orderController.verifyPayment,
);

export default router;
