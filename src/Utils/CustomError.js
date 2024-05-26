class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode <= 500 ? "failed" : "ok";
    this.isOperation = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = CustomError;
