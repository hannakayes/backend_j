// routes/musik.routes.js
const mongoose = require("mongoose");
const Musik = require("../models/Musik.model");
const { isAuthenticated } = require("../middlewares/route-guard.middleware");

const router = require("express").Router();

// All routes start with /api/musik
router.get("/", async (req, res, next) => {
  try {
    const musikData = await Musik.find().populate(
      "createdBy",
      "username email"
    );
    res.json(musikData);
  } catch (error) {
    next(error);
  }
});

router.get("/:musikId", async (req, res, next) => {
  const { musikId } = req.params;
  if (!mongoose.isValidObjectId(musikId)) {
    return next(new Error("Invalid ID"));
  }

  try {
    const musik = await Musik.findById(musikId);
    if (!musik) {
      throw new Error("Musik not found!");
    }
    res.status(200).json(musik);
  } catch (error) {
    next(error);
  }
});

router.post("/", isAuthenticated, async (req, res, next) => {
  try {
    const newMusik = await Musik.create({
      ...req.body,
      createdBy: req.tokenPayload.userId,
    });
    res.status(201).json(newMusik);
  } catch (error) {
    next(error);
  }
});

router.put("/:musikId", isAuthenticated, async (req, res, next) => {
  const { musikId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(musikId)) {
    return next(new Error("Invalid ID"));
  }

  try {
    const updatedMusik = await Musik.findByIdAndUpdate(musikId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedMusik) {
      return next(new Error("Musik not found"));
    }
    res.status(200).json(updatedMusik);
  } catch (error) {
    next(error);
  }
});

router.delete("/:musikId", isAuthenticated, async (req, res, next) => {
  const { musikId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(musikId)) {
    return next(new Error("Invalid ID"));
  }

  try {
    const musikToDelete = await Musik.findById(musikId);
    if (!musikToDelete) {
      return next(new Error("Musik not found"));
    }
    if (musikToDelete.createdBy === req.tokenPayload.userId) {
      await Musik.findByIdAndDelete(musikId);
      res.status(204).send();
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
