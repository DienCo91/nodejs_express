const User = require("../Models/userModal");
const asyncErrorHandler = require("../Utils/asyncErrorHandler");
const jwt = require("jsonwebtoken");
const CustomError = require("../Utils/CustomError");

const getToken = (id) => {
  return jwt.sign({ id: id }, process.env.SECRET_STR, {
    expiresIn: process.env.TOKEN_EXPIRES,
  });
};

exports.getAllUser = asyncErrorHandler(async (req, res, next) => {
  const user = await User.find();

  res.status(200).json({
    status: "OK",
    length: user.length,
    data: user,
  });
});

exports.signUp = async (req, res) => {
  try {
    await User.create(req.body);
    res.status(201).json({
      status: "Created",
    });
  } catch (err) {
    res.status(400).json({
      status: "Error",
      message: err,
    });
  }
};

exports.signIn = asyncErrorHandler(async (req, res, next) => {
  try {
    const user = await User.findOne({ name: req.body.name }).select(
      "+password"
    );

    const isMatchPassword = await user.comparePasswordInDB(
      req.body.password,
      user.password
    );
    if (!isMatchPassword) {
      const error = new CustomError("Password not match", 400);
      next(error);
    }
    if (!user) throw new Error();
    else {
      const token = getToken(user._id);
      const userObj = user.toObject();
      delete userObj.password;
      res.status(200).json({
        status: "Success",
        data: userObj,
        token: token,
      });
    }
  } catch (err) {
    const error = new CustomError("Not Found", 404);
    next(error);
  }
});

exports.updateUser = asyncErrorHandler(async (req, res, next) => {
  console.log(req.body);
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({
      status: "Success",
      data: user,
    });
  } catch (err) {
    const error = new CustomError("Not Found", 404);
    next(error);
  }
});
