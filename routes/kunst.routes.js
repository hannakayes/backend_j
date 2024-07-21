// routes/kunst.routes.js
const mongoose = require("mongoose");
const Kunst = require("../models/Kunst.model");
const { isAuthenticated } = require("../middlewares/route-guard.middleware");

const router = require("express").Router();

// All routes start with /api/kunst
router.get("/", async (req, res, next) => {
  try {
    const kunstData = await Kunst.find().populate(
      "createdBy",
      "username email"
    );
    res.json(kunstData);
  } catch (error) {
    next(error);
  }
});

router.get("/:kunstId", async (req, res, next) => {
  const { kunstId } = req.params;
  if (!mongoose.isValidObjectId(kunstId)) {
    return next(new Error("Invalid ID"));
  }

  try {
    const kunst = await Kunst.findById(kunstId);
    if (!kunst) {
      throw new Error("Kunst not found!");
    }
    res.status(200).json(kunst);
  } catch (error) {
    next(error);
  }
});

router.post("/", isAuthenticated, async (req, res, next) => {
  try {
    const newKunst = await Kunst.create({
      ...req.body,
      createdBy: req.tokenPayload.userId,
    });
    res.status(201).json(newKunst);
  } catch (error) {
    next(error);
  }
});

router.put("/:kunstId", isAuthenticated, async (req, res, next) => {
  const { kunstId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(kunstId)) {
    return next(new Error("Invalid ID"));
  }

  try {
    const updatedKunst = await Kunst.findByIdAndUpdate(kunstId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedKunst) {
      return next(new Error("Kunst not found"));
    }
    res.status(200).json(updatedKunst);
  } catch (error) {
    next(error);
  }
});

router.delete("/:kunstId", isAuthenticated, async (req, res, next) => {
  const { kunstId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(kunstId)) {
    return next(new Error("Invalid ID"));
  }

  try {
    const kunstToDelete = await Kunst.findById(kunstId);
    if (!kunstToDelete) {
      return next(new Error("Kunst not found"));
    }
    if (kunstToDelete.createdBy === req.tokenPayload.userId) {
      await Kunst.findByIdAndDelete(kunstId);
      res.status(204).send();
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
