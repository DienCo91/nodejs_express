const ProfileUser = require("../Models/profileModal");
const User = require("../Models/userModal");
const asyncErrorHandler = require("../Utils/asyncErrorHandler")

exports.createProfile = asyncErrorHandler(async (req, res, next) => {

    const profile = await ProfileUser.create(req.body)
    console.log(profile._id,req.user);
    let user = await User.findByIdAndUpdate(req.user._id, { profile: profile._id }, {
        new: true,
        runValidators: true,
    })
    
    res.status(200).json({
        data: user,
        message: "success"
    })

})