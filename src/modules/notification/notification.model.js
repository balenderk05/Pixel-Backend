import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    // Notification kis admin ke liye hai
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
      index: true,
    },

    // Notification category
    type: {
      type: String,
      enum: ["NEW_ORDER", "PAYMENT_SUCCESS", "ORDER_STATUS_CHANGED"],
      required: true,
    },

    // Notification heading
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // Notification message
    message: {
      type: String,
      required: true,
      trim: true,
    },

    // Related order
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
      index: true,
    },

    // Order number directly available for quick display
    orderNumber: {
      type: String,
      default: null,
      trim: true,
    },

    // Admin ne notification read ki ya nahi
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  },   
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
