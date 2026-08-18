import express from 'express';

import productController from './product.controller.js';

const router = express.Router()

router.get(
    "/",
    productController.getActiveProducts
);

router.get(
    "/:slug",
    productController.getProductBySlug
);


export default router;