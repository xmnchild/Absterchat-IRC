const UsersModel = require("../models/Users");

exports.getAllUsers = async () => {
    return await UsersModel.find();
};

exports.createUsers = async (users) => {
    return await UsersModel.create(users);
};
exports.getUsersById = async (id) => {
    return await UsersModel.findById(id);
};


exports.updateUsers = async (id, users) => {
    return await UsersModel.findByIdAndUpdate(id, users);
};

exports.deleteUsers = async (id) => {
    return await UsersModel.findByIdAndDelete(id);
};