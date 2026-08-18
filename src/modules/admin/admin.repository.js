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


export default {
    createAdmin,
    findByPhone,
    findByPhoneWithPassword
};