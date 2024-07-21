const { default: mongoose } = require("mongoose");
const Dokus = require("../models/Dokus.model");
const { isAuthenticated } = require("../middlewares/route-guard.middleware");
const router = require("express").Router();

router.get("/", async (req, res, next) => {
  try {
    const dokusData = await Dokus.find();
    res.json(dokusData);
  } catch (error) {
    next(error);
  }
});

router.get("/:dokusId", async (req, res, next) => {
  const { dokusId } = req.params;
  if (!mongoose.isValidObjectId(dokusId)) {
    return next(new Error("Invalid ID"));
  }

  try {
    const dokus = await Dokus.findById(dokusId);
    if (!dokus) {
      throw new Error("Dokus not found!");
    }
    res.status(200).json(dokus);
  } catch (error) {
    next(error);
  }
});

router.post("/", isAuthenticated, async (req, res, next) => {
  try {
    const newDokus = await Dokus.create({
      ...req.body,
      createdBy: req.tokenPayload.userId,
    });
    res.status(201).json(newDokus);
  } catch (error) {
    next(error);
  }
});

router.put("/:dokusId", isAuthenticated, async (req, res, next) => {
  const { dokusId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(dokusId)) {
    return next(new Error("Invalid ID"));
  }

  try {
    const updatedDokus = await Dokus.findByIdAndUpdate(dokusId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedDokus) {
      return next(new Error("Dokus not found"));
    }
    res.status(200).json(updatedDokus);
  } catch (error) {
    next(error);
  }
});

router.delete("/:dokusId", isAuthenticated, async (req, res, next) => {
  const { dokusId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(dokusId)) {
    return next(new Error("Invalid ID"));
  }

  try {
    const dokusToDelete = await Dokus.findById(dokusId);
    if (!dokusToDelete) {
      return next(new Error("Dokus not found"));
    }
    if (dokusToDelete.createdBy === req.tokenPayload.userId) {
      await Dokus.findByIdAndDelete(dokusId);
      res.status(204).send();
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
