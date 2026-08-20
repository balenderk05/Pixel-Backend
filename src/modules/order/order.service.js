import orderRepository from "./order.repository.js";
import productRepository from "../product/product.repository.js";

import AppError from "../../utils/appError.js";
import generateOrderNumber from "../../utils/generateOrderNumber.js";

const createOrder = async ({
    productId,
    quantity,
    customer
}) => {

    // 1. Find product
    const product =
        await productRepository.findProductById(
            productId
        );

    // 2. Product existence check
    if (!product ) {
        throw new AppError(
            "Product not found",
            404
        );
    }

    // 3. Product active check
    if (!product.isActive) {
        throw new AppError(
            "Product is currently unavailable",
            400
        );
    }

    // 4. Quantity validation
    if (quantity < product.minQuantity) {
        throw new AppError(
            `Minimum quantity is ${product.minQuantity} meter`,
            400
        );
    }

    if (quantity > product.maxQuantity) {
        throw new AppError(
            `Maximum quantity is ${product.maxQuantity} meter`,
            400
        );
    }

    // 5. Backend price calculation
    const totalAmount =
        quantity * product.pricePerUnit;

    // 6. Generate order number
    const orderNumber =
        generateOrderNumber();

    // 7. Create order
    const order =
        await orderRepository.createOrder({
            orderNumber,

            product: product._id,

            productName: product.name,

            quantity,

            unit: product.unit,

            pricePerUnit: product.pricePerUnit,

            totalAmount,

            customer,

            status: "PENDING",

            paymentStatus: "PENDING"
        });

    return order;
};

export default {
    createOrder
};