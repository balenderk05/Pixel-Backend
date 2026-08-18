import asyncHandler from "../../utils/asyncHandler.js";
import * as adminService from "./admin.service.js";

const register = asyncHandler(
    async (req, res) => {
        const admin =
            await adminService.registerAdmin(
                req.body
            );

        res.status(201).json({
            success: true,
            message: "Admin registered successfully",
            data: admin
        });
    }
);

const login = asyncHandler(
    async (req, res) => {
        const { phone, password } = req.body;

        const result =
            await adminService.loginAdmin(
                phone,
                password
            );

        res.status(200).json({
            success: true,
            message: "Admin login successful",
            data: result
        });
    }
);

export {
    register,
    login
};