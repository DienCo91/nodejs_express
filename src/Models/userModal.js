const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    unique: true,
    minlength: [3, "Movies must have at least 4 characters"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    validate: {
      validator: function (value) {
        return validator.isEmail(value);
      },
      message: "{VALUE} is not a valid Email",
    },
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters"],
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, "Confirm password is required"],
    minlength: [8, "Confirm password must be at least 8 characters"],
    select: false,
    validate: {
      validator: function (value) {
        // dung function de tham chieu dung, ko dung arrow function

        return value === this.password;
      },
      message: "Password confirmation does not match password",
    },
  },
  photo: { type: String },
  passwordResetToken: { type: String },
  passwordResetTokenExpires: { type: Date },
});

// userSchema.path("confirmPassword").validate(function (value) {
//   return this.password === value;
// }, "Password confirmation does not match password");
// xu li ma hoa mk kh save db
userSchema.pre("save", async function (next) {
  // neu password thay doi thi ma hoa tiep neu khong thi save vao db
  if (!this.isModified("password")) {
    next();
  } else {
    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined;
    next();
  }
});
// kiem tra mat khau nguyen dang va mat khau da hash
userSchema.methods.comparePasswordInDB = async function (password, passwordDB) {
  return await bcrypt.compare(password, passwordDB);
};
// create token
userSchema.methods.createResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
