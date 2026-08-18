import { z } from "zod";

const createProductSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Product name is required"),

    slug: z
        .string()
        .trim()
        .min(1, "Product slug is required")
        .regex(
            /^[a-z0-9-]+$/,
            "Slug can only contain lowercase letters, numbers and hyphens"
        ),

    unit: z
        .literal("meter"),

    pricePerUnit: z
        .number()
        .positive("Price must be greater than 0"),

    minQuantity: z
        .number()
        .int("Minimum quantity must be an integer")
        .positive("Minimum quantity must be greater than 0"),

    maxQuantity: z
        .number()
        .int("Maximum quantity must be an integer")
        .positive("Maximum quantity must be greater than 0")
});



const updateProductSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(2)
            .optional(),

        slug: z
            .string()
            .trim()
            .min(2)
            .optional(),

        unit: z
            .string()
            .trim()
            .min(1)
            .optional(),

        pricePerUnit: z
            .number()
            .positive()
            .optional(),

        minQuantity: z
            .number()
            .int()
            .positive()
            .optional(),

        maxQuantity: z
            .number()
            .int()
            .positive()
            .optional()
    })
    .refine(
        (data) => Object.keys(data).length > 0,
        {
            message: "At least one field is required"
        }
    );

const updateProductStatusSchema = z.object({
    isActive: z.boolean()
});

export {
    createProductSchema,
    updateProductSchema,
    updateProductStatusSchema
};