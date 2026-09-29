import orderRepository from "./order.repository.js";
import productRepository from "../product/product.repository.js";
import notificationService from "../notification/notification.service.js";
import adminRepository from "../admin/admin.repository.js";
     
import AppError from "../../utils/appError.js";
import generateOrderNumber from "../../utils/generateOrderNumber.js";
import razorpayService from "../../services/razorpay.service.js";
import emailService from "../../services/email.service.js";
import env from "../../config/env.js";
import crypto from "crypto";
import mongoose from "mongoose";
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

  try {
    const admins = await adminRepository.findActiveAdmins();

    await Promise.all(
      admins.map((admin) =>
        notificationService.createNotification({
          adminId: admin._id,
          type: "NEW_ORDER",

          title: "New Pixel Order",

          message:
            `${updatedOrder.customer.name} purchased ` +
            `${updatedOrder.quantity} ${updatedOrder.unit} ` +
            `${updatedOrder.productName}`,

          orderId: updatedOrder._id,

          orderNumber: updatedOrder.orderNumber,
        }),
      ),
    );

    // console.log(`Admin notification created for ${updatedOrder.orderNumber}`);
  } catch (error) {
    console.error(
      `Failed to create admin notification for ${updatedOrder.orderNumber}:`,
      error,
    );
  }
  // 12. Send customer order confirmation email
  try {
    await emailService.sendOrderConfirmationEmail({
      customerEmail: updatedOrder.customer.email,

      customerName: updatedOrder.customer.name,

      orderNumber: updatedOrder.orderNumber,

      productName: updatedOrder.productName,

      quantity: updatedOrder.quantity,

      unit: updatedOrder.unit,

      pricePerUnit: updatedOrder.pricePerUnit,

      totalAmount: updatedOrder.totalAmount,

      address: {
        addressLine1: updatedOrder.customer.addressLine1,

        addressLine2: updatedOrder.customer.addressLine2,

        city: updatedOrder.customer.city,

        state: updatedOrder.customer.state,

        pincode: updatedOrder.customer.pincode,
      },
    });

    // console.log(
    //   `Order confirmation email sent for ${updatedOrder.orderNumber}`,
    // );
  } catch (error) {
    // Payment is already successful.
    // Email failure should NOT fail the payment/order.
    console.error(
      `Failed to send order confirmation email for ${updatedOrder.orderNumber}:`,
      error,
    );
  }

  try {
    await emailService.sendAdminNewOrderEmail({
      orderNumber: updatedOrder.orderNumber,

      customerName: updatedOrder.customer.name,

      customerEmail: updatedOrder.customer.email,

      customerPhone: updatedOrder.customer.phone,

      productName: updatedOrder.productName,

      quantity: updatedOrder.quantity,

      unit: updatedOrder.unit,

      pricePerUnit: updatedOrder.pricePerUnit,

      totalAmount: updatedOrder.totalAmount,

      address: {
        addressLine1: updatedOrder.customer.addressLine1,

        addressLine2: updatedOrder.customer.addressLine2,

        city: updatedOrder.customer.city,

        state: updatedOrder.customer.state,

        pincode: updatedOrder.customer.pincode,
      },
    });

    // console.log(`Admin order email sent for ${updatedOrder.orderNumber}`);
  } catch (error) {
    console.error(
      `Failed to send admin order email for ${updatedOrder.orderNumber}:`,
      error,
    );
  }

  return updatedOrder;
};

const getOrders = async ({ page, limit, status, paymentStatus }) => {
  const result = await orderRepository.findOrders({
    page,
    limit,
    status,
    paymentStatus,
  });

  const totalPages = Math.ceil(result.total / limit);

  return {
    orders: result.orders,

    pagination: {
      page,
      limit,
      totalOrders: result.total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};

const getOrderById = async (orderId) => {
  if (!mongoose.isValidObjectId(orderId)) {
    throw new AppError("Invalid order ID", 400);
  }

  const order = await orderRepository.findOrderById(orderId);

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  return order;
};

// Allowed status transitions
const allowedStatusTransitions = {
  PENDING: ["PAYMENT_PENDING", "CANCELLED"],

  PAYMENT_PENDING: ["PAID", "PAYMENT_FAILED", "CANCELLED"],

  PAID: ["PROCESSING", "CANCELLED"],

  PROCESSING: ["COMPLETED", "CANCELLED"],

  COMPLETED: [],

  CANCELLED: [],

  PAYMENT_FAILED: [],
};

// Helper function to send order status email to customer
const sendOrderStatusEmail = async (order) => {
  await emailService.sendOrderStatusUpdateEmail({
    customerEmail: order.customer.email,
    customerName: order.customer.name,
    orderNumber: order.orderNumber,
    productName: order.productName,
    quantity: order.quantity,
    unit: order.unit,
    orderStatus: order.status,
    estimatedDeliveryDate: order.estimatedDeliveryDate,
  });

  // console.log(`Order status email sent for ${order.orderNumber}`);
};

//Helper function to create notifications for all admins when order status changes
const createOrderStatusNotifications = async (order) => {
  const admins = await adminRepository.findActiveAdmins();

  await Promise.all(
    admins.map((admin) =>
      notificationService.createNotification({
        adminId: admin._id,
        type: "ORDER_STATUS_CHANGED",
        title: "Order Status Updated",
        message:
          `${order.orderNumber} status changed to ` +
          `${order.status} for ` +
          `${order.customer.name}`,
        orderId: order._id,
        orderNumber: order.orderNumber,
      }),
    ),
  );

  // console.log(
  //     `Admin status notification created for ${order.orderNumber}`
  // );
};

const updateOrderStatus = async ({
  orderId,
  status,
  estimatedDeliveryDate,
}) => {
  const order = await orderRepository.findOrderById(orderId);

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  const currentStatus = order.status;

  if (currentStatus === status) {
    throw new AppError(`Order is already in ${status} status`, 400);
  }

  const allowedStatuses = allowedStatusTransitions[currentStatus] || [];

  if (!allowedStatuses.includes(status)) {
    throw new AppError(
      `Cannot change order status from ${currentStatus} to ${status}`,
      400,
    );
  }

  if (estimatedDeliveryDate) {
    const deliveryDate = new Date(`${estimatedDeliveryDate}T00:00:00.000Z`);

    if (Number.isNaN(deliveryDate.getTime())) {
      throw new AppError("Invalid estimated delivery date", 400);
    }

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    if (deliveryDate <= today) {
      throw new AppError("Estimated delivery date must be in the future", 400);
    }
  }

  // 1. Update order first
  const updatedOrder = await orderRepository.updateOrderStatus(orderId, {
    status,
    estimatedDeliveryDate,
  });

  // 2. Send notifications in background
  Promise.allSettled([
    sendOrderStatusEmail(updatedOrder),
    createOrderStatusNotifications(updatedOrder),
  ]).then((results) => {
    results.forEach((result, index) => {
      if (result.status === "rejected") {
        console.error(
          index === 0
            ? `Failed to send status email for ${updatedOrder.orderNumber}:`
            : `Failed to create admin notification for ${updatedOrder.orderNumber}:`,
          result.reason,
        );
      }
    });
  });

  // 3. Return immediately
  return updatedOrder;
};

export default {
  createOrder,
  createPaymentOrder,
  verifyPayment,
  getOrders,
  getOrderById,
  updateOrderStatus,
};
