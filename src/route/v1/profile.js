const { protectRouter } = require("../../Controller/authController");
const { createProfile } = require("../../Controller/profileController");
const express = require("express");

const router = express.Router();

router.post('/',protectRouter,createProfile)

module.exports = router;