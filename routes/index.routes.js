// routes/index.routes.js
const router = require("express").Router();

// Import route files
const recipesRoutes = require("./rezepte.routes");
const bingoRoutes = require("./bingo.routes");
const dokusRoutes = require("./dokus.routes");
const filmeRoutes = require("./filme.routes");
const kunstRoutes = require("./kunst.routes");
const musikRoutes = require("./musik.routes");
const serienRoutes = require("./serien.routes");

// Base route
router.get("/", (req, res) => {
  res.json("All good in here");
});

// Use route files
router.use("/recipes", recipesRoutes);
router.use("/bingo", bingoRoutes);
router.use("/dokus", dokusRoutes);
router.use("/filme", filmeRoutes);
router.use("/kunst", kunstRoutes);
router.use("/musik", musikRoutes);
router.use("/serien", serienRoutes);

module.exports = router;
