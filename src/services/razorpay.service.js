import env from "../config/env.js";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: env.razorpay.keyId,
  key_secret: env.razorpay.keySecret,
});

const createRazorpayOrder = async ({ amount, receipt }) => {
  const order = await razorpay.orders.create({
    amount,
    currency: "INR",
    receipt,
  });

  return order;
};

const fetchRazorpayPayment = async (paymentId) => {
  const payment = await razorpay.payments.fetch(paymentId);

  return payment;
};

export default {
  createRazorpayOrder,
  fetchRazorpayPayment,
};
