// routes/serien.routes.js
const mongoose = require("mongoose");
const Serie = require("../models/Serie.model");
const { isAuthenticated } = require("../middlewares/route-guard.middleware");

const router = require("express").Router();

// All routes start with /api/serien
router.get("/", async (req, res, next) => {
  try {
    const serienData = await Serie.find().populate(
      "createdBy",
      "username email"
    );
    res.json(serienData);
  } catch (error) {
    next(error);
  }
});

router.get("/:serieId", async (req, res, next) => {
  const { serieId } = req.params;
  if (!mongoose.isValidObjectId(serieId)) {
    return next(new Error("Invalid ID"));
  }

  try {
    const serie = await Serie.findById(serieId);
    if (!serie) {
      throw new Error("Serie not found!");
    }
    res.status(200).json(serie);
  } catch (error) {
    next(error);
  }
});

router.post("/", isAuthenticated, async (req, res, next) => {
  try {
    const newSerie = await Serie.create({
      ...req.body,
      createdBy: req.tokenPayload.userId,
    });
    res.status(201).json(newSerie);
  } catch (error) {
    next(error);
  }
});

router.put("/:serieId", isAuthenticated, async (req, res, next) => {
  const { serieId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(serieId)) {
    return next(new Error("Invalid ID"));
  }

  try {
    const updatedSerie = await Serie.findByIdAndUpdate(serieId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedSerie) {
      return next(new Error("Serie not found"));
    }
    res.status(200).json(updatedSerie);
  } catch (error) {
    next(error);
  }
});

router.delete("/:serieId", isAuthenticated, async (req, res, next) => {
  const { serieId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(serieId)) {
    return next(new Error("Invalid ID"));
  }

  try {
    const serieToDelete = await Serie.findById(serieId);
    if (!serieToDelete) {
      return next(new Error("Serie not found"));
    }
    if (serieToDelete.createdBy === req.tokenPayload.userId) {
      await Serie.findByIdAndDelete(serieId);
      res.status(204).send();
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
