import express from "express";

import notificationController from "./notification.controller.js";

import authenticateAdmin from "../../middleware/auth.middleware.js";

const router = express.Router();

//Get admin notifications
router.get("/", authenticateAdmin, notificationController.getNotifications);

//Get unread notification count
router.get(
  "/unread-count",
  authenticateAdmin,
  notificationController.getUnreadCount,
);

router.get(
  "/:id",
  authenticateAdmin,
  notificationController.getNotificationById,
);
// Mark one notification as read
router.patch("/:id/read", authenticateAdmin, notificationController.markAsRead);

// Mark all notifications as read
router.patch(
  "/read-all",
  authenticateAdmin,
  notificationController.markAllAsRead,
);

export default router;
