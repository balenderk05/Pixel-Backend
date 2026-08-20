import { z } from "zod";

const createOrderSchema = z.object({
    productId: z
        .string()
        .min(1, "Product ID is required"),

    quantity: z
        .number()
        .positive("Quantity must be greater than 0"),

    customer: z.object({
        name: z
            .string()
            .trim()
            .min(2, "Name is required"),

        phone: z
            .string()
            .trim()
            .regex(
                /^[6-9]\d{9}$/,
                "Please enter a valid 10 digit Indian mobile number"
            ),

        addressLine1: z
            .string()
            .trim()
            .min(5, "Address is required"),

        addressLine2: z
            .string()
            .trim()
            .optional()
            .default(""),

        city: z
            .string()
            .trim()
            .min(2, "City is required"),

        state: z
            .string()
            .trim()
            .min(2, "State is required"),

        pincode: z
            .string()
            .trim()
            .regex(
                /^\d{6}$/,
                "Pincode must be 6 digits"
            )
    })
});

export {
    createOrderSchema
};