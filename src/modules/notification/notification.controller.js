import notificationService from "./notification.service.js";
import asyncHandler from "../../utils/asyncHandler.js";

//Get admin notifications
const getNotifications = asyncHandler(async (req, res) => {
  const adminId = req.admin.id;

  const page = Number(req.query.page) || 1;

  const limit = Number(req.query.limit) || 20;

  let isRead;

  if (req.query.isRead !== undefined) {
    isRead = req.query.isRead === "true";
  }

  const result = await notificationService.getNotifications({
    adminId,
    page,
    limit,
    isRead,
  });

  res.status(200).json({
    success: true,
    message: "Notifications fetched successfully",
    data: result,
  });
});

//Get unread notification count
const getUnreadCount = asyncHandler(async (req, res) => {
  const adminId = req.admin.id;

  const result = await notificationService.getUnreadCount(adminId);

  res.status(200).json({
    success: true,
    message: "Unread notification count fetched successfully",
    data: result,
  });
});

//Mark one notification as read
const markAsRead = asyncHandler(async (req, res) => {
  const adminId = req.admin.id;

  const { id: notificationId } = req.params;

  const notification = await notificationService.markAsRead({
    notificationId,
    adminId,
  });

  res.status(200).json({
    success: true,
    message: "Notification marked as read",
    data: notification,
  });
});

//Mark all notifications as read
const markAllAsRead = asyncHandler(async (req, res) => {
  const adminId = req.admin.id;

  const result = await notificationService.markAllAsRead(adminId);

  res.status(200).json({
    success: true,
    message: "All notifications marked as read",
    data: result,
  });
});

const getNotificationById = asyncHandler(async (req, res) => {
  const adminId = req.admin.id;

  const { id: notificationId } = req.params;

  const notification = await notificationService.getNotificationById({
    notificationId,
    adminId,
  });

  res.status(200).json({
    success: true,
    message: "Notification fetched successfully",
    data: notification,
  });
});

export default {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  getNotificationById,
};
