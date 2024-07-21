const jwt = require("jsonwebtoken");

const isAuthenticated = (req, res, next) => {
  try {
    // Check for token in Authorization header
    const authHeader = req.headers.authorization;
    let token;

    if (authHeader) {
      token = authHeader.split(" ")[1];
    } else if (req.cookies && req.cookies.authToken) {
      // Check for token in cookies
      token = req.cookies.authToken;
    } else {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    if (!token) {
      return res
        .status(401)
        .json({
          message: "Token missing from Authorization header or cookies",
        });
    }

    if (!process.env.TOKEN_SECRET) {
      console.error("TOKEN_SECRET environment variable is not set");
      return res.status(500).json({ message: "Server configuration error" });
    }

    // Verify the token
    const payload = jwt.verify(token, process.env.TOKEN_SECRET);
    req.tokenPayload = payload;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      // Handle token expiration specifically
      return res.status(401).json({ message: "Token has expired" });
    } else if (error.name === "JsonWebTokenError") {
      // Handle invalid token
      return res.status(401).json({ message: "Invalid token" });
    }
    // General error
    console.error("Token verification error:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = { isAuthenticated };
