import express from 'express';

import productController from './product.controller.js';
import validate from "../../middleware/validate.middleware.js";
import { createProductSchema,updateProductSchema, updateProductStatusSchema } from "./product.validation.js";
import authenticateAdmin from '../../middleware/auth.middleware.js';

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
    authenticateAdmin,
    validate(createProductSchema),
    productController.createProduct
);

router.patch(
    "/:id",
    authenticateAdmin,
    validate(updateProductSchema),
    productController.updateProduct
);

router.patch(
    "/:id/status",
    authenticateAdmin,
    validate(updateProductStatusSchema),
    productController.updateProductStatus
);

export default router;