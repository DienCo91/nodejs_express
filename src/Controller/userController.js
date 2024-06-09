const User = require("../Models/userModal");

exports.getAllUser = async (req, res) => {
  try {
    const user = await User.find();
    res.status(200).json({
      status: "OK",
      length: user.length,

      data: user,
    });
  } catch (err) {
    res.status(404).json({
      status: "Error",
    });
  }
};

exports.postUser = async (req, res) => {
  console.log(req);
  try {
    const user = await User.create(req.body);
    res.status(201).json({
      status: "Created",
      data: user,
    });
  } catch (err) {
    res.status(400).json({
      status: "Error",
      message: err,
    });
  }
};
