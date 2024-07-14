const Course = require("../Models/courseModal");
const User = require("../Models/userModal");
const asyncErrorHandler = require("../Utils/asyncErrorHandler");

exports.createCourse = asyncErrorHandler(async (req,res,next) => {
    const course =await Course.create(req.body)
    res.status(200).json({
        status: 'success',
        data:course
    })
})


exports.updateCourseById = asyncErrorHandler(async (req,res,next) => {
   
    const course =await Course.findById(req.params.id)
    const user = await User.findById(req.user._id)
    console.log(course._id,user._id);
    course.users.push(user._id)
    user.courses.push(course._id)
    await course.save()
    await user.save()
    res.status(200).json({
        status: 'success',
        
    })
})

exports.getCourse =asyncErrorHandler(async (req,res,next) => {
    const course =await Course.find().populate('users')
    res.status(200).json({
        status: 'success',
        data:course
    })
})