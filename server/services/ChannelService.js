const ChannelModel = require("../models/Channel");

exports.getAllChannel = async () => {
    return await ChannelModel.find();
};

exports.createChannel = async (channel) => {
    return await ChannelModel.create(channel);
};
exports.getChannelById = async (id) => {
    return await ChannelModel.findById(id);
};

exports.updateChannel = async (id, channel) => {
    return await ChannelModel.findByIdAndUpdate(id, channel);
};

exports.deleteChannel = async (id) => {
    return await ChannelModel.findByIdAndDelete(id);
};



//update user (add ) dans channel
exports.addUserChannel = async (id, channel) => {
    return await ChannelModel.findByIdAndUpdate(id, channel);
};


//update user (delete) dans channel
exports.deleteUserChannel = async (id, channel) => {
    return await ChannelModel.findByIdAndUpdate(id, channel);
};

// ajoute un message dans canal
exports.addMessageChannel = async (id, channel) => {
    return await ChannelModel.findByIdAndUpdate(id, channel);
};

