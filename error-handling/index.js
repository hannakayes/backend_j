// error-handling/index.js

module.exports = (app) => {
  // Middleware to handle 404 errors (when route does not exist)
  app.use((req, res) => {
    res.status(404).json({
      message:
        "This route does not exist, you should probably look at your URL or what your backend is expecting",
    });
  });

  // Middleware to handle general errors
  app.use((err, req, res, next) => {
    console.error("ERROR", req.method, req.path, err); // Log the error details

    // Only send a response if headers haven't been sent already
    if (!res.headersSent) {
      res.status(err.status || 500).json({
        message:
          err.message || "Internal server error. Check the server console",
        // Include stack trace in development mode
        ...(process.env.NODE_ENV === "development" ? { stack: err.stack } : {}),
      });
    }
  });
};
