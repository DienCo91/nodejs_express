const express = require("express");
const { createCourse, getCourse, updateCourseById } = require("../../Controller/courseController");
const { protectRouter } = require("../../Controller/authController");


const router = express.Router();

router.post('/',protectRouter, createCourse)
router.get('/',protectRouter, getCourse)
router.patch('/:id',protectRouter, updateCourseById)

module.exports = router;