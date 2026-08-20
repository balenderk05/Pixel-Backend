import asyncHandler from "../../utils/asyncHandler.js";
import orderService from "./order.service.js";

const createOrder = asyncHandler(
    async (req, res) => {

        const order =
            await orderService.createOrder(
                req.body
            );

        res.status(201).json({
            success: true,
            message: "Order created successfully",
            data: order
        });
    }
);

export default {
    createOrder
};