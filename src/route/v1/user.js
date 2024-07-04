const express = require("express");
const {
  getAllUser,
  signUp,
  signIn,
  updateUser,
} = require("../../Controller/userController");
const { protectRouter, restrict } = require("../../Controller/authController");

const router = express.Router();

router.get("/", protectRouter, restrict("admin"), getAllUser);
router.post("/signup", signUp);
router.post("/login", signIn);
router.put("/:id", protectRouter, restrict("admin"), updateUser);

module.exports = router;
