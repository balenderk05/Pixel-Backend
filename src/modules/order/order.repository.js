import Order from "./order.model.js";

const createOrder = async (orderData) => {
  return Order.create(orderData);
};

const findOrderByNumber = async (orderNumber) => {
  return Order.findOne({
    orderNumber,
  });
};

const findOrderById = async (orderId) => {
  return Order.findById(orderId).lean();
};

const updateOrderById = async (orderId, updateData) => {
  return Order.findByIdAndUpdate(orderId, updateData, {
    new: true,
    runValidators: true,
  });
};

const findOrders = async ({ page = 1, limit = 10, status, paymentStatus }) => {
  const skip = (page - 1) * limit;

  const filter = {};

  if (status) {
    filter.status = status;
  }

  if (paymentStatus) {
    filter.paymentStatus = paymentStatus;
  }

  const [orders, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),

    Order.countDocuments(filter),
  ]);

  return {
    orders,
    total,
  };
};
export default {
  createOrder,
  findOrderByNumber,
  findOrderById,
  updateOrderById,
  findOrders,
};
