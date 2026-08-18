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

    if(!product){
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

export default {
    createProduct,
    getProductBySlug,
    getActiveProducts
}