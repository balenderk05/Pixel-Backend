import jwt from "jsonwebtoken";

import env from "../config/env.js";
import AppError from "../utils/appError.js";
import adminRepository from "../modules/admin/admin.repository.js";

const authenticateAdmin = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            throw new AppError(
                "Authorization token is required",
                401
            );
        }

        if (!authHeader.startsWith("Bearer ")) {
            throw new AppError(
                "Invalid authorization format",
                401
            );
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            throw new AppError(
                "Authorization token is required",
                401
            );
        }

        const decoded = jwt.verify(
            token,
            env.jwtSecret
        );

        const admin =
            await adminRepository.findById(
                decoded.adminId
            );

        if (!admin) {
            throw new AppError(
                "Admin not found",
                401
            );
        }

        if (!admin.isActive) {
            throw new AppError(
                "Admin account is inactive",
                403
            );
        }

        if (admin.role !== "admin") {
            throw new AppError(
                "Access denied",
                403
            );
        }

        req.admin = {
            id: admin._id.toString(),
            phone: admin.phone,
            role: admin.role
        };

        next();

    } catch (error) {

        if (error instanceof jwt.JsonWebTokenError) {
            return next(
                new AppError(
                    "Invalid or expired token",
                    401
                )
            );
        }

        next(error);
    }
};

export default authenticateAdmin;