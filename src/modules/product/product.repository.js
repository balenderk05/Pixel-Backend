import Product from "./product.model.js";

const createProduct = async (productData) => {
    return Product.create(productData);
};

const findProductBySlug = async (slug) => {
    return Product.findOne({slug});
}

const findProductById = async (productId) => {
    return Product.findById(productId);
};

const findActiveProducts = async () => {
    return Product.find({
        isActive:true
    });
};


const updateProductById = async (
    productId,
    updateData
) => {
    return Product.findByIdAndUpdate(
        productId,
        updateData,
        {
            new: true,
            runValidators: true
        }
    );
};

const updateProductStatus = async (
    productId,
    isActive
) => {
    return Product.findByIdAndUpdate(
        productId,
        {
            isActive
        },
        {
            new: true,
            runValidators: true
        }
    );
};

export default {
    createProduct,
    findProductBySlug,
    findProductById,
    findActiveProducts,
    updateProductById,
    updateProductStatus
}