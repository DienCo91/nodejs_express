const express = require("express");
const {
  getAllUser,
  signUp,
  signIn,
} = require("../../Controller/userController");

const router = express.Router();

router.get("/", getAllUser);
router.post("/signup", signUp);
router.post("/login", signIn);

module.exports = router;
