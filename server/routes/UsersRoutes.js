const express = require("express");
const {
    getAllUsers,
    createUsers,
    getUsersById,
    updateUsers,
    deleteUsers,
} = require("../controllers/UsersController");

const router = express.Router();

router.route("/").get(getAllUsers).post(createUsers);
router.route("/:id").get(getUsersById).put(updateUsers).delete(deleteUsers);

module.exports = router;