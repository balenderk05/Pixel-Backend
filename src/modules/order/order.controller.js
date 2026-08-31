import asyncHandler from "../../utils/asyncHandler.js";
import orderService from "./order.service.js";

const createOrder = asyncHandler(async (req, res) => {
  const order = await orderService.createOrder(req.body);

  res.status(201).json({
    success: true,
    message: "Order created successfully",
    data: order,
  });
});

const createPaymentOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const paymentOrder = await orderService.createPaymentOrder(id);

  res.status(200).json({
    success: true,
    message: "Razorpay order created successfully",
    data: paymentOrder,
  });
});

const verifyPayment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

  const order = await orderService.verifyPayment({
    orderId: id,
    razorpayPaymentId,
    razorpayOrderId,
    razorpaySignature,
  });

  res.status(200).json({
    success: true,
    message: "Payment verified successfully",
    data: order,
  });
});

const getOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, paymentStatus } = req.query;

  const result = await orderService.getOrders({
    page: Number(page),
    limit: Number(limit),
    status,
    paymentStatus,
  });

  res.status(200).json({
    success: true,
    message: "Orders fetched successfully",
    data: result,
  });
});

const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const order = await orderService.getOrderById(id);

  res.status(200).json({
    success: true,
    message: "Order fetched successfully",
    data: order,
  });
});
export default {
  createOrder,
  createPaymentOrder,
  verifyPayment,
  getOrders,
  getOrderById,
};
