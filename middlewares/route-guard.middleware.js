const jwt = require("jsonwebtoken");

const isAuthenticated = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json("Authorization header missing");
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json("Token missing from Authorization header");
    }

    if (!process.env.TOKEN_SECRET) {
      console.error("TOKEN_SECRET environment variable is not set");
      return res.status(500).json("Server configuration error");
    }

    const payload = jwt.verify(token, process.env.TOKEN_SECRET);
    req.tokenPayload = payload;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json("Invalid or expired token");
  }
};

module.exports = { isAuthenticated };
