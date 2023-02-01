const express = require("express");
const {
    getAllMessages,
    createMessages
} = require("../controllers/MessagesController");

const router = express.Router();

router.route("/").get(getAllMessages).post(createMessages)

module.exports = router;

