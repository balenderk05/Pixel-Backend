import express from "express";

import validate from "../../middleware/validate.middleware.js";

import {
    registerAdminSchema,
    loginAdminSchema
} from "./admin.validation.js";

import {
    register,
    login
} from "./admin.controller.js";

const router = express.Router();

router.post(
    "/register",
    validate(registerAdminSchema),
    register
);

router.post(
    "/login",
    validate(loginAdminSchema),
    login
);

export default router;