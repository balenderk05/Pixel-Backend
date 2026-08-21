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
  return Order.findById(orderId);
};

const updateOrderById = async (orderId, updateData) => {
  return Order.findByIdAndUpdate(orderId, updateData, {
    new: true,
    runValidators: true,
  });
};

export default {
  createOrder,
  findOrderByNumber,
  findOrderById,
  updateOrderById,
};
