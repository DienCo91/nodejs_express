const devError = (error, res) => {
  res.status(error.statusCode || 500).json({
    message: `${error.message}`,
    status: error.status || 500,
    stackTrace: error.stack,
    error: error,
  });
};

const prodError = (error, res) => {
  if (error.isOperation) {
    res.status(error.statusCode || 400).json({
      message: `${error.message}`,
      status: error.status || 400,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Error",
    });
  }
};

const expiredToken = (err, res) => {
  res.status(401).json({
    status: "401",
    message: "expired token",
  });
};

const handleErrorGlobal = (error, req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    console.log("Error Global development");
    if (error.message === "jwt expired") {
      expiredToken(error, res);
    }
    devError(error, res);
  } else {
    console.log("Error Global production");
    prodError(error, res);
  }
  next();
};
module.exports = handleErrorGlobal;
