const Book = require("../Models/bookModal");
const User = require("../Models/userModal");
const asyncErrorHandler = require("../Utils/asyncErrorHandler");

exports.createBook = asyncErrorHandler(async(req, res, next) => {
    const book = await Book.create(req.body)
    const user = await User.findById(req.user._id)
    user.books.push(book._id)
    await user.save()
    res.status(200).json({
        message:"Book created successfully",
        data:user
    })
})