function errorMiddleware(err, req, res, _next) {
  const status = err.status || 500
  res.status(status).json({
    ok: false,
    error: err.message || "Server error",
  })
}

module.exports = {
  errorMiddleware,
}
