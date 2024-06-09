const express = require("express");
const { getAllUser, postUser } = require("../../Controller/userController");

const router = express.Router();

router.get("/", getAllUser);
router.post("/", postUser);

module.exports = router;
