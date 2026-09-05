import Notification from "./notification.model.js";

// Create a new notification
const createNotification = async (notificationData) => {
  return Notification.create(notificationData);
};

//Get notifications for an admin
const findNotificationsByAdmin = async ({
  adminId,
  page = 1,
  limit = 20,
  isRead,
}) => {
  const skip = (page - 1) * limit;

  const filter = {
    admin: adminId,
  };

  // Optional read/unread filter
  if (typeof isRead === "boolean") {
    filter.isRead = isRead;
  }

  const [notifications, total] = await Promise.all([
    Notification.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Notification.countDocuments(filter),
  ]);

  return {
    notifications,
    total,
  };
};

//Count unread notifications
const countUnreadNotifications = async (adminId) => {
  return Notification.countDocuments({
    admin: adminId,
    isRead: false,
  });
};

//Find notification by ID
const findNotificationById = async (notificationId) => {
  return Notification.findById(notificationId);
};

// Mark one notification as read
const markAsRead = async (notificationId, adminId) => {
  return Notification.findOneAndUpdate(
    {
      _id: notificationId,
      admin: adminId,
    },
    {
      $set: {
        isRead: true,
      },
    },
    {
      new: true,
    }
  );
};

// Mark all notifications as read
const markAllAsRead = async (adminId) => {
  return Notification.updateMany(
    {
      admin: adminId,
      isRead: false,
    },
    {
      $set: {
        isRead: true,
      },
    }
  );
};

export default {
  createNotification,
  findNotificationsByAdmin,
  countUnreadNotifications,
  findNotificationById,
  markAsRead,
  markAllAsRead,
};