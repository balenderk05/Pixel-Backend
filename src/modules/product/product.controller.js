import productService from "./product.service.js";
import asyncHandler from "../../utils/asyncHandler.js";

const getActiveProducts = asyncHandler(
    async (req, res) => {
        const products =
            await productService.getActiveProducts();

        res.status(200).json({
            success: true,
            data: products
        });
    }
);

const getProductBySlug = asyncHandler(
    async (req, res) => {
        const { slug } = req.params;

        const product =
            await productService.getProductBySlug(slug);

        res.status(200).json({
            success: true,
            data: product
        });
    }
);

const createProduct = asyncHandler(
    async (req, res) => {
        const product =
            await productService.createProduct(req.body);

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: product
        });
    }
);

export default {
    getActiveProducts,
    getProductBySlug,
    createProduct
};