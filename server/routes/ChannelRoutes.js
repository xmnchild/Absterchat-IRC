const express = require("express");
const {
    getAllChannel,
    createChannel,
    getChannelById,
    updateChannel,
    addUserChannel,
    deleteUserChannel, 
    deleteChannel,
    addMessageChannel,
} = require("../controllers/ChannelController");

const router = express.Router();

router.route("/").get(getAllChannel).post(createChannel);
router.route("/:id").get(getChannelById).put(updateChannel).delete(deleteChannel);
router.route("/adduser/:id").put(addUserChannel);
router.route("/deleteuser/:id").put(deleteUserChannel);
router.route("/message/:id").put(addMessageChannel);
module.exports = router;