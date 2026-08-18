import express from 'express';

import productController from './product.controller.js';
import validate from "../../middleware/validate.middleware.js";
import { createProductSchema } from "./product.validation.js";

const router = express.Router()

router.get(
    "/",
    productController.getActiveProducts
);

router.get(
    "/:slug",
    productController.getProductBySlug
);

router.post(
    "/",
    validate(createProductSchema),
    productController.createProduct
);

export default router;