import notificationRepository from "./notification.repository.js";
import AppError from "../../utils/appError.js";
import mongoose from "mongoose";

//Create a new notification
const createNotification = async ({
  adminId,
  type,
  title,
  message,
  orderId = null,
  orderNumber = null,
}) => {
  // Validate admin ID
  if (!mongoose.isValidObjectId(adminId)) {
    throw new AppError("Invalid admin ID", 400);
  }

  // Validate order ID if provided
  if (orderId !== null && !mongoose.isValidObjectId(orderId)) {
    throw new AppError("Invalid order ID", 400);
  }

  const notification = await notificationRepository.createNotification({
    admin: adminId,
    type,
    title,
    message,
    order: orderId,
    orderNumber,
  });

  return notification;
};

// Get admin notifications
const getNotifications = async ({ adminId, page = 1, limit = 20, isRead }) => {
  if (!mongoose.isValidObjectId(adminId)) {
    throw new AppError("Invalid admin ID", 400);
  }

  if (page < 1) {
    throw new AppError("Page must be greater than 0", 400);
  }

  if (limit < 1 || limit > 100) {
    throw new AppError("Limit must be between 1 and 100", 400);
  }

  const result = await notificationRepository.findNotificationsByAdmin({
    adminId,
    page,
    limit,
    isRead,
  });

  const totalPages = Math.ceil(result.total / limit);

  return {
    notifications: result.notifications,

    pagination: {
      page,
      limit,
      totalNotifications: result.total,
      totalPages,

      hasNextPage: page < totalPages,

      hasPreviousPage: page > 1,
    },
  };
};

//Get unread notification count
const getUnreadCount = async (adminId) => {
  if (!mongoose.isValidObjectId(adminId)) {
    throw new AppError("Invalid admin ID", 400);
  }

  const count = await notificationRepository.countUnreadNotifications(adminId);

  return {
    unreadCount: count,
  };
};

//Mark one notification as read
const markAsRead = async ({ notificationId, adminId }) => {
  if (!mongoose.isValidObjectId(notificationId)) {
    throw new AppError("Invalid notification ID", 400);
  }

  if (!mongoose.isValidObjectId(adminId)) {
    throw new AppError("Invalid admin ID", 400);
  }

  const notification = await notificationRepository.markAsRead(
    notificationId,
    adminId,
  );

  if (!notification) {
    throw new AppError("Notification not found", 404);
  }

  return notification;
};

//Mark all notifications as read
const markAllAsRead = async (adminId) => {
  if (!mongoose.isValidObjectId(adminId)) {
    throw new AppError("Invalid admin ID", 400);
  }

  const result = await notificationRepository.markAllAsRead(adminId);

  return {
    modifiedCount: result.modifiedCount,
  };
};

const getNotificationById = async ({ notificationId, adminId }) => {
  if (!mongoose.isValidObjectId(notificationId)) {
    throw new AppError("Invalid notification ID", 400);
  }

  if (!mongoose.isValidObjectId(adminId)) {
    throw new AppError("Invalid admin ID", 400);
  }

  const notification =
    await notificationRepository.findNotificationById(notificationId);

  if (!notification) {
    throw new AppError("Notification not found", 404);
  }

  // Security check
  if (notification.admin.toString() !== adminId.toString()) {
    throw new AppError("Access denied", 403);
  }

  return notification;
};

export default {
  createNotification,
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  getNotificationById,
};
