import productRepository from "./product.repository.js";
import AppError from './../../utils/appError.js';

const createProduct = async (productData) => {
    const existingProduct = await productRepository.findProductBySlug(productData.slug);

    if(existingProduct){
        throw new AppError(
            "Product already exist",
            409
        )
    }

    return productRepository.createProduct(productData);
};

const getProductBySlug = async (slug) => {
    const product = await productRepository.findProductBySlug(slug);

    if(!product || !product.isActive){
        throw new AppError(
            "Product not found",
            404
        );
    }
    return product;

};

const getActiveProducts = async () => {
    return productRepository.findActiveProducts();
};


const updateProduct = async (
    productId,
    updateData
) => {
    const product =
        await productRepository.findProductById(
            productId
        );

    if (!product || !product.isActive) {
        throw new AppError(
            "Product not found",
            404
        );
    }

    if (
        updateData.slug &&
        updateData.slug !== product.slug
    ) {
        const existingProduct =
            await productRepository.findProductBySlug(
                updateData.slug
            );

        if (existingProduct) {
            throw new AppError(
                "Product with this slug already exists",
                409
            );
        }
    }

    const updatedProduct =
        await productRepository.updateProductById(
            productId,
            updateData
        );

    return updatedProduct;
};

const updateProductStatus = async (
    productId,
    isActive
) => {
    const product =
        await productRepository.findProductById(
            productId
        );

    if (!product || !product.isActive) {
        throw new AppError(
            "Product not found",
            404
        );
    }

    return productRepository.updateProductStatus(
        productId,
        isActive
    );
};


export default {
    createProduct,
    getProductBySlug,
    getActiveProducts,
    updateProduct,
    updateProductStatus
}