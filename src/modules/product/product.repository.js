import Product from "./product.model.js";

const createProduct = async (productData) => {
    return Product.create(productData);
};

const findProductBySlug = async (slug) => {
    return Product.findOne({slug});
}

const findActiveProducts = async () => {
    return Product.find({
        isActive:true
    });
};

export default {
    createProduct,
    findProductBySlug,
    findActiveProducts
}