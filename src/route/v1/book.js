const express = require("express");
const { createBook } = require("../../Controller/bookController");
const { protectRouter } = require("../../Controller/authController");

const router = express.Router();

router.post('/',protectRouter, createBook)

module.exports = router;