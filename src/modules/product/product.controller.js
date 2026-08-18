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

const updateProduct = asyncHandler(
    async (req, res) => {
        const { id } = req.params;

        const product =
            await productService.updateProduct(
                id,
                req.body
            );

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: product
        });
    }
);

const updateProductStatus = asyncHandler(
    async (req, res) => {
        const { id } = req.params;

        const { isActive } = req.body;

        const product =
            await productService.updateProductStatus(
                id,
                isActive
            );

        res.status(200).json({
            success: true,
            message: "Product status updated successfully",
            data: product
        });
    }
);

export default {
    getActiveProducts,
    getProductBySlug,
    createProduct,
    updateProduct,
    updateProductStatus
};