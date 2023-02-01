const MessagesModel = require("../models/Messages");

exports.getAllMessages = async () => {
    return await MessagesModel.find();
};

exports.createMessages = async (users) => {
    return await MessagesModel.create(users);
};
