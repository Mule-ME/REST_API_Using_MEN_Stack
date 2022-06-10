const errorHandler = (err, req, res, next) => {

  //@desc Checking if the status code is exis else use 500
  const statusCode = res.statusCode ? res.statusCode : 500;

  //@desc use statusCode
  res.status(statusCode);

  //@desc status message
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};


module.exports = {
    errorHandler,
}