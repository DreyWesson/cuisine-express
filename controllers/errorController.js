const httpStatus = require("http-status-codes");

function errorHandler(res, errorCode, errorDetails = "Page doesn't exist") {
  res.render(`../views/error${errorCode}.ejs`, {
    error: errorCode,
    details: errorDetails,
  });
}

exports.respondNoResourceFound = (req, res) => {
  let errorCode = httpStatus.NOT_FOUND;
  res.status(errorCode);
  errorHandler(res, errorCode);
};
exports.respondInternalError = (error, req, res, next) => {
  let errorCode = httpStatus.INTERNAL_SERVER_ERROR;
  let errorStack = error.stack;
  res.status(errorCode);
  errorHandler(res, errorCode, errorStack);
};
