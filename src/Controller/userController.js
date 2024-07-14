const User = require("../Models/userModal");
const asyncErrorHandler = require("../Utils/asyncErrorHandler");
const jwt = require("jsonwebtoken");
const CustomError = require("../Utils/CustomError");
const { sendEmail } = require("../Utils/email");
const crypto = require("crypto");

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

exports.getUserById = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findOne({_id: req.params.id}).populate('profile').populate('books').populate('courses')
  res.status(200).json({
    status: "OK",
    length: user.length,
    data: user,
  });
});

exports.signUp = async (req, res) => {
  try {
   const user= await User.create(req.body);
    res.status(201).json({
      status: "Created",
      user:user
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
    ).populate('profile');

    if (!user) throw new Error();
    const isMatchPassword = await user.comparePasswordInDB(
      req.body.password,
      user.password
    );
    if (!isMatchPassword) {
      const error = new CustomError("Password not match", 400);
      next(error);
    } else {
      const token = getToken(user._id);
      user.password = undefined;
      const options = {
        maxAge: 1000 * 60 * 60 * 24 * 10,
        httpOnly: true,
        //secure:true // env production
      };
      res.cookie("jwt", token, options);
      res.status(200).json({
        status: "Success",
        data: user,
        token: token,
      });
    }
  } catch (err) {
    // const error = new CustomError("Not Found", 404);
    next(error);
  }
});

exports.updateUser = asyncErrorHandler(async (req, res, next) => {
  if (req.body.password || req.body.confirmPassword) {
    next(new CustomError("Can not update password using this endpoint", 400));
  }
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
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

exports.forgotPassword = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.query.email });
  if (!user) {
    const error = new CustomError("Not Found", 404);
    next(error);
  }
  // generate random reset token
  const resetToken = user.createResetPasswordToken();
  // create token
  await user.save({ validateBeforeSave: false });
  //send mail

  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/reset-password/${resetToken}`;
  const message = `Click link to reset password \n\n${resetURL}\n\n apply in 10 minutes`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Your reset password",
      message,
    });

    res.status(200).send({
      message: "success",
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    user.save({ validateBeforeSave: false });
    next(error);
  }
});

exports.passwordReset = asyncErrorHandler(async (req, res, next) => {
  const token = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetTokenExpires: { $gt: Date.now() },
  });
  if (!user) {
    next(new CustomError("Token expired !", 401));
  }
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;
  await user.save();

  res.status(201).json({
    status: "Success Reset password !",
  });
});

exports.updatePassword = asyncErrorHandler(async (req, res, next) => {
  // get password user from db
  const user = await User.findById(req.user._id).select("+password");
  // check user exist
  if (!user) {
    next(new CustomError("User not found", 404));
  }
  // check password correct
  const isCorrectPassword = await user.comparePasswordInDB(
    req.body.currentPassword,
    user.password
  );
  if (!isCorrectPassword) {
    next(new CustomError("Password incorrect", 401));
  }
  user.password = req.body.newPassword;
  user.confirmPassword = req.body.confirmPassword;
  await user.save();

  const token = getToken(user._id);

  res.status(200).json({
    message: "User change password successfully",
    token: token,
  });
});
