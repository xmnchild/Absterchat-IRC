const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const usersSchema =  new Schema({
    users: [],
    content: [], 
});

module.exports = mongoose.model("Messages", usersSchema);

