const { default: mongoose } = require("mongoose");
const Bingo = require("../models/Bingo.model");
const { isAuthenticated } = require("../middlewares/route-guard.middleware");
const router = require("express").Router();

router.get("/", async (req, res, next) => {
  try {
    const bingoData = await Bingo.find();
    res.json(bingoData);
  } catch (error) {
    next(error);
  }
});

router.get("/:bingoId", async (req, res, next) => {
  const { bingoId } = req.params;
  if (!mongoose.isValidObjectId(bingoId)) {
    return next(new Error("Invalid ID"));
  }

  try {
    const bingo = await Bingo.findById(bingoId);
    if (!bingo) {
      throw new Error("Bingo not found!");
    }
    res.status(200).json(bingo);
  } catch (error) {
    next(error);
  }
});

router.post("/", isAuthenticated, async (req, res, next) => {
  try {
    const newBingo = await Bingo.create({
      ...req.body,
      createdBy: req.tokenPayload.userId,
    });
    res.status(201).json(newBingo);
  } catch (error) {
    next(error);
  }
});

router.put("/:bingoId", isAuthenticated, async (req, res, next) => {
  const { bingoId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(bingoId)) {
    return next(new Error("Invalid ID"));
  }

  try {
    const updatedBingo = await Bingo.findByIdAndUpdate(bingoId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedBingo) {
      return next(new Error("Bingo not found"));
    }
    res.status(200).json(updatedBingo);
  } catch (error) {
    next(error);
  }
});

router.delete("/:bingoId", isAuthenticated, async (req, res, next) => {
  const { bingoId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(bingoId)) {
    return next(new Error("Invalid ID"));
  }

  try {
    const bingoToDelete = await Bingo.findById(bingoId);
    if (!bingoToDelete) {
      return next(new Error("Bingo not found"));
    }
    if (bingoToDelete.createdBy === req.tokenPayload.userId) {
      await Bingo.findByIdAndDelete(bingoId);
      res.status(204).send();
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
