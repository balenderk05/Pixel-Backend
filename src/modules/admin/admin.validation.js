import { z } from "zod";

const registerAdminSchema = z.object({
    phone: z
        .string()
        .trim()
        .regex(
            /^[6-9]\d{9}$/,
            "Please enter a valid 10 digit Indian mobile number"
        ),

    password: z
        .string()
        .min(6, "Password must be at least 6 characters")
});

const loginAdminSchema = z.object({
    phone: z
        .string()
        .trim()
        .regex(
            /^[6-9]\d{9}$/,
            "Please enter a valid 10 digit Indian mobile number"
        ),

    password: z
        .string()
        .min(1, "Password is required")
});

export {
    registerAdminSchema,
    loginAdminSchema
};