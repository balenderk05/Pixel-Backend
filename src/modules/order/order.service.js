import orderRepository from "./order.repository.js";
import productRepository from "../product/product.repository.js";

import AppError from "../../utils/appError.js";
import generateOrderNumber from "../../utils/generateOrderNumber.js";
import razorpayService from "../../services/razorpay.service.js";
import env from "../../config/env.js";
import crypto from "crypto";
const createOrder = async ({ productId, quantity, customer }) => {
  // 1. Find product
  const product = await productRepository.findProductById(productId);

  // 2. Product existence check
  if (!product) {
    throw new AppError("Product not found", 404);
  }

  // 3. Product active check
  if (!product.isActive) {
    throw new AppError("Product is currently unavailable", 400);
  }

  // 4. Quantity validation
  if (quantity < product.minQuantity) {
    throw new AppError(`Minimum quantity is ${product.minQuantity} meter`, 400);
  }

  if (quantity > product.maxQuantity) {
    throw new AppError(`Maximum quantity is ${product.maxQuantity} meter`, 400);
  }

  // 5. Backend price calculation
  const totalAmount = quantity * product.pricePerUnit;

  // 6. Generate order number
  const orderNumber = generateOrderNumber();

  // 7. Create order
  const order = await orderRepository.createOrder({
    orderNumber,

    product: product._id,

    productName: product.name,

    quantity,

    unit: product.unit,

    pricePerUnit: product.pricePerUnit,

    totalAmount,

    customer,

    status: "PENDING",

    paymentStatus: "PENDING",
  });

  return order;
};

const createPaymentOrder = async (orderId) => {
  const order = await orderRepository.findOrderById(orderId);

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  if (order.paymentStatus === "PAID") {
    throw new AppError("Order is already paid", 400);
  }

  if (order.razorpayOrderId) {
    return {
      order,

      razorpay: {
        keyId: env.razorpay.keyId,
        orderId: order.razorpayOrderId,
        amount: Math.round(order.totalAmount * 100),
        currency: "INR",
      },
    };
  }

  const amountInPaise = Math.round(order.totalAmount * 100);

  const razorpayOrder = await razorpayService.createRazorpayOrder({
    amount: amountInPaise,
    receipt: order.orderNumber,
  });

  const updatedOrder = await orderRepository.updateOrderById(orderId, {
    razorpayOrderId: razorpayOrder.id,

    status: "PAYMENT_PENDING",
  });

  return {
    order: updatedOrder,

    razorpay: {
      keyId: env.razorpay.keyId,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    },
  };
};

const verifyPayment = async ({
  orderId,
  razorpayPaymentId,
  razorpayOrderId,
  razorpaySignature,
}) => {
  // 1. Find our order
  const order = await orderRepository.findOrderById(orderId);

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  // 2. Prevent duplicate payment
  if (order.paymentStatus === "PAID") {
    throw new AppError("Order is already paid", 400);
  }

  // 3. Verify Razorpay Order ID
  if (order.razorpayOrderId !== razorpayOrderId) {
    throw new AppError("Invalid Razorpay order ID", 400);
  }

  // 4. Generate signature
  const generatedSignature = crypto
    .createHmac("sha256", env.razorpay.keySecret)
    .update(`${order.razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  // 5. Timing-safe signature comparison
  const isValidSignature =
    generatedSignature.length === razorpaySignature.length &&
    crypto.timingSafeEqual(
      Buffer.from(generatedSignature),
      Buffer.from(razorpaySignature),
    );

  if (!isValidSignature) {
    throw new AppError("Payment signature verification failed", 400);
  }

  // 6. Fetch actual payment from Razorpay
  const razorpayPayment =
    await razorpayService.fetchRazorpayPayment(razorpayPaymentId);

  // 7. Verify Razorpay Order ID
  if (razorpayPayment.order_id !== order.razorpayOrderId) {
    throw new AppError("Payment does not belong to this order", 400);
  }

  // 8. Verify payment amount
  const expectedAmount = Math.round(order.totalAmount * 100);

  if (razorpayPayment.amount !== expectedAmount) {
    throw new AppError("Payment amount mismatch", 400);
  }

  // 9. Verify currency
  if (razorpayPayment.currency !== "INR") {
    throw new AppError("Invalid payment currency", 400);
  }

  // 10. Verify payment status
  if (razorpayPayment.status !== "captured") {
    throw new AppError(
      `Payment is not captured. Current status: ${razorpayPayment.status}`,
      400,
    );
  }

  // 11. Update our order
  const updatedOrder = await orderRepository.updateOrderById(orderId, {
    razorpayPaymentId,

    razorpaySignature,

    status: "PAID",

    paymentStatus: "PAID",
  });

  return updatedOrder;
};

export default {
  createOrder,
  createPaymentOrder,
  verifyPayment,
};
