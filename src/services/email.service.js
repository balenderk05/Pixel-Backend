import nodemailer from "nodemailer";                      
import env from "../config/env.js";

const transporter = nodemailer.createTransport({
  host: env.email.host,
  port: env.email.port,
  secure: false,

  auth: {
    user: env.email.user,
    pass: env.email.password,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  if (!to) {
    throw new Error("Recipient email is required");
  }

  const info = await transporter.sendMail({
    from: `"Pixel Commerce" <${env.email.user}>`,
    to,
    subject,
    html,
  });

  return info;
};

const sendOrderConfirmationEmail = async ({
  customerEmail,
  customerName,
  orderNumber,
  productName,
  quantity,
  unit,
  pricePerUnit,
  totalAmount,
  address,
}) => {
  return sendEmail({
    to: customerEmail,

    subject: `Order Confirmed - ${orderNumber}`,

    html: `
            <!DOCTYPE html>
            <html>
            <body style="font-family: Arial, sans-serif;">

                <h2>Order Confirmed 🎉</h2>

                <p>
                    Hi <strong>${customerName}</strong>,
                </p>

                <p>
                    Thank you for your purchase.
                    Your order has been successfully confirmed.
                </p>

                <hr />

                <h3>Order Details</h3>

                <p>
                    <strong>Order Number:</strong>
                    ${orderNumber}
                </p>

                <p>
                    <strong>Product:</strong>
                    ${productName}
                </p>

                <p>
                    <strong>Quantity:</strong>
                    ${quantity} ${unit}
                </p>

                <p>
                    <strong>Price:</strong>
                    ₹${pricePerUnit} / ${unit}
                </p>

                <p>
                    <strong>Total Paid:</strong>
                    ₹${totalAmount}
                </p>

                <hr />

                <h3>Delivery Address</h3>

                <p>
                    ${address.addressLine1}<br />
                    ${
                      address.addressLine2
                        ? `${address.addressLine2}<br />`
                        : ""
                    }
                    ${address.city},
                    ${address.state} -
                    ${address.pincode}
                </p>

                <hr />

                <p>
                    <strong>Order Status:</strong> PAID
                </p>

                <p>
                    We will notify you when your order status changes.
                </p>

                <p>
                    Thank you for choosing Pixel Commerce.
                </p>

            </body>
            </html>
        `,
  });
};

const sendAdminNewOrderEmail = async ({
  orderNumber,
  customerName,
  customerEmail,
  customerPhone,
  productName,
  quantity,
  unit,
  pricePerUnit,
  totalAmount,
  address,
}) => {
  return sendEmail({
    to: env.adminEmail,

    subject: `🔔 New Pixel Order - ${orderNumber}`,

    html: `
            <!DOCTYPE html>
            <html>
            <body style="font-family: Arial, sans-serif;">

                <h2>🔔 New Pixel Order Received</h2>

                <p>
                    A new order has been successfully paid.
                </p>

                <hr />

                <h3>Order Details</h3>

                <p>
                    <strong>Order Number:</strong>
                    ${orderNumber}
                </p>

                <p>
                    <strong>Product:</strong>
                    ${productName}
                </p>

                <p>
                    <strong>Quantity:</strong>
                    ${quantity} ${unit}
                </p>

                <p>
                    <strong>Price Per Unit:</strong>
                    ₹${pricePerUnit} / ${unit}
                </p>

                <p>
                    <strong>Total Amount:</strong>
                    ₹${totalAmount}
                </p>

                <p>
                    <strong>Payment Status:</strong>
                    PAID
                </p>

                <hr />

                <h3>Customer Details</h3>

                <p>
                    <strong>Name:</strong>
                    ${customerName}
                </p>

                <p>
                    <strong>Email:</strong>
                    ${customerEmail}
                </p>

                <p>
                    <strong>Phone:</strong>
                    ${customerPhone}
                </p>

                <hr />

                <h3>Delivery Address</h3>

                <p>
                    ${address.addressLine1}<br />

                    ${
                      address.addressLine2
                        ? `${address.addressLine2}<br />`
                        : ""
                    }

                    ${address.city},
                    ${address.state} -
                    ${address.pincode}
                </p>

                <hr />

                <p>
                    Please process this order from the admin dashboard.
                </p>

            </body>
            </html>
        `,
  });
};

const sendOrderStatusUpdateEmail = async ({
  customerEmail,
  customerName,
  orderNumber,
  productName,
  quantity,
  unit,
  orderStatus,
  estimatedDeliveryDate,
}) => {
  const formattedDeliveryDate = estimatedDeliveryDate
    ? new Date(estimatedDeliveryDate).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "Not available";

  return sendEmail({
    to: customerEmail,

    subject: `Order Status Updated - ${orderNumber}`,

    html: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif;">

        <h2>📦 Order Status Updated</h2>

        <p>
          Hi <strong>${customerName}</strong>,
        </p>

        <p>
          Your order status has been updated successfully.
        </p>

        <hr />

        <h3>Order Details</h3>

        <p>
          <strong>Order Number:</strong>
          ${orderNumber}
        </p>

        <p>
          <strong>Product:</strong>
          ${productName}
        </p>

        <p>
          <strong>Quantity:</strong>
          ${quantity} ${unit}
        </p>

        <p>
          <strong>Order Status:</strong>
          ${orderStatus}
        </p>

        <p>
          <strong>Estimated Delivery:</strong>
          ${formattedDeliveryDate}
        </p>

        <hr />

        <p>
          We will notify you again if there are any further updates
          to your order.
        </p>

        <p>
          Thank you for choosing Pixel Commerce.
        </p>

      </body>
      </html>
    `,
  });
};
export default {
  sendEmail,
  sendOrderConfirmationEmail,
  sendAdminNewOrderEmail,
  sendOrderStatusUpdateEmail,
};
            