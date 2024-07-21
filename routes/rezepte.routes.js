const express = require("express");
const router = express.Router();
const Rezept = require("../models/Rezept.model"); // Updated path to new model name
const mongoose = require("mongoose");
const { isAuthenticated } = require("../middlewares/route-guard.middleware");

// All routes start with /api/rezepte

// Get all recipes
router.get("/", async (req, res, next) => {
  try {
    const rezepte = await Rezept.find().populate("createdBy", "username email");
    res.json(rezepte);
  } catch (error) {
    next(error);
  }
});

// Get a single recipe by ID
router.get("/:rezeptId", async (req, res, next) => {
  const { rezeptId } = req.params;
  if (!mongoose.isValidObjectId(rezeptId)) {
    return next(new Error("Invalid ID"));
  }

  try {
    const rezept = await Rezept.findById(rezeptId);
    if (!rezept) {
      throw new Error("Rezept not found!");
    }
    res.status(200).json(rezept);
  } catch (error) {
    next(error);
  }
});

// Create a new recipe
router.post("/", isAuthenticated, async (req, res, next) => {
  try {
    const newRezept = await Rezept.create({
      ...req.body,
      createdBy: req.tokenPayload.userId,
    });
    res.status(201).json(newRezept);
  } catch (error) {
    next(error);
  }
});

// Update a recipe by ID
router.put("/:rezeptId", isAuthenticated, async (req, res, next) => {
  const { rezeptId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(rezeptId)) {
    return next(new Error("Invalid ID"));
  }

  try {
    const updatedRezept = await Rezept.findByIdAndUpdate(rezeptId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedRezept) {
      return next(new Error("Rezept not found"));
    }
    res.status(200).json(updatedRezept);
  } catch (error) {
    next(error);
  }
});

// Delete a recipe by ID
router.delete("/:rezeptId", isAuthenticated, async (req, res, next) => {
  const { rezeptId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(rezeptId)) {
    return next(new Error("Invalid ID"));
  }

  try {
    const rezeptToDelete = await Rezept.findById(rezeptId);
    if (!rezeptToDelete) {
      return next(new Error("Rezept not found"));
    }
    if (rezeptToDelete.createdBy.equals(req.tokenPayload.userId)) {
      await Rezept.findByIdAndDelete(rezeptId);
      res.status(204).send();
    } else {
      res.status(403).json({ message: "Unauthorized" });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
