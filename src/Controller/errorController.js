const handleErrorGlobal = (error, req, res, next) => {
  console.log("Error Global", error);
  res.status(error.statusCode || 400).json({
    message: `${error.message}`,
    status: error.status || 400,
  });
  next();
};
module.exports = handleErrorGlobal;
