import Admin from "./admin.model.js";

const createAdmin = async (adminData) => {
    return Admin.create(adminData);
};

const findByPhone = async (phone) => {
    return Admin.findOne({ phone });
};

const findByPhoneWithPassword = async (phone) => {
    return Admin
        .findOne({ phone })
        .select("+password");
};

const findById = async (adminId) => {
    return Admin.findById(adminId);
};

export default {
    createAdmin,
    findByPhone,
    findByPhoneWithPassword,
    findById
};