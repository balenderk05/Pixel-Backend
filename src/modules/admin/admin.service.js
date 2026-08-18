import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import adminRepository from "./admin.repository.js";
import AppError from "../../utils/appError.js";
import env from "../../config/env.js";

const registerAdmin = async (adminData) => {
    const existingAdmin =
        await adminRepository.findByPhone(
            adminData.phone
        );

    if (existingAdmin) {
        throw new AppError(
            "Admin with this phone number already exists",
            409
        );
    }

    const hashedPassword = await bcrypt.hash(
        adminData.password,
        12
    );

    const admin =
        await adminRepository.createAdmin({
            phone: adminData.phone,
            password: hashedPassword
        });

    return {
        id: admin._id,
        phone: admin.phone,
        role: admin.role
    };
};

const loginAdmin = async (phone, password) => {
    const admin =
        await adminRepository.findByPhoneWithPassword(
            phone
        );

    if (!admin) {
        throw new AppError(
            "Invalid phone number or password",
            401
        );
    }

    if (!admin.isActive) {
        throw new AppError(
            "Admin account is inactive",
            403
        );
    }

    const isPasswordValid =
        await bcrypt.compare(
            password,
            admin.password
        );

    if (!isPasswordValid) {
        throw new AppError(
            "Invalid phone number or password",
            401
        );
    }

    const token = jwt.sign(
        {
            adminId: admin._id.toString(),
            role: admin.role
        },
        env.jwtSecret,
        {
            expiresIn: env.jwtExpiresIn
        }
    );

    return {
        admin: {
            id: admin._id,
            phone: admin.phone,
            role: admin.role
        },
        accessToken: token
    };
};

export {
    registerAdmin,
    loginAdmin
};