const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { isAuthenticated } = require("../middlewares/route-guard.middleware");
const router = require("express").Router();

// All routes start with /auth
router.get("/", (req, res) => {
  res.json("All good in auth");
});

/* POST Signup
router.post("/signup", async (req, res, next) => {
  const { password, ...userData } = req.body;
  const salt = bcrypt.genSaltSync(13);
  const passwordHash = bcrypt.hashSync(password, salt);

  try {
    const newUser = await User.create({ ...userData, passwordHash });
    res.status(201).json(newUser);
  } catch (error) {
    if (error.code === 11000) {
      res.status(409).json({ message: "Username already exists" });
    } else {
      next(error);
    }
  }
}); */

// POST Login
router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const potentialUser = await User.findOne({ username });
    if (potentialUser) {
      if (bcrypt.compareSync(password, potentialUser.passwordHash)) {
        const token = jwt.sign(
          { userId: potentialUser._id },
          process.env.TOKEN_SECRET, // Ensure this environment variable is set
          {
            algorithm: "HS256",
            expiresIn: "6h",
          }
        );
        res.json({ token });
      } else {
        res.status(403).json({ message: "Incorrect password" });
      }
    } else {
      res.status(404).json({ message: "No user with this username" });
    }
  } catch (error) {
    next(error);
  }
});

// GET Verify
router.get("/verify", isAuthenticated, (req, res, next) => {
  res.json({ message: "Token valid" });
});

module.exports = router;
