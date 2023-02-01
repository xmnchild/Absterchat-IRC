const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const channelSchema =  new Schema({
    name: String,
    users: [],
    content: [],    
});

module.exports = mongoose.model("Channel", channelSchema);
