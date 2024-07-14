const User = require("../Models/userModal");
const asyncErrorHandler = require("../Utils/asyncErrorHandler");
const CustomError = require("../Utils/CustomError");
const jwt = require("jsonwebtoken");
const util = require("util");
exports.protectRouter = asyncErrorHandler(async (req, res, next) => {
  //1 read token and check if it exists
  const tokenTest = req.headers["authorization"];
  let token;

  if (tokenTest && tokenTest.startsWith("Bearer")) {
    token = tokenTest.split(/\s+/)[1];
  }
  if (!token) {
    const error = new CustomError(
      "Unauthenticated, you are not logged in",
      401
    );
    next(error);
  }

  //2 validate token
  const { id, iat, exp } = await util.promisify(jwt.verify)(
    token,
    process.env.SECRET_STR
  );

  //3 if user exists
  const user = await User.findById(id).populate('profile');
  if (!user) {
    const error = new CustomError("User not found", 404);
    next(error);
  }
  //4 if user changed password after the token was issued

  //5 allow user to access routes
  req.user = user;
  
  next();
});

exports.restrict = (role) => {
  return (req, res, next) => {
    if (req.user.role === role) {
      next();
    } else {
      const error = new CustomError("You do n not have permission", 403);
      next(error);
    }
  };
};
