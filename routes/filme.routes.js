const { default: mongoose } = require("mongoose");
const Filme = require("../models/Filme.model");
const { isAuthenticated } = require("../middlewares/route-guard.middleware");
const router = require("express").Router();

router.get("/", async (req, res, next) => {
  try {
    const filmeData = await Filme.find();
    res.json(filmeData);
  } catch (error) {
    next(error);
  }
});

router.get("/:filmeId", async (req, res, next) => {
  const { filmeId } = req.params;
  if (!mongoose.isValidObjectId(filmeId)) {
    return next(new Error("Invalid ID"));
  }

  try {
    const filme = await Filme.findById(filmeId);
    if (!filme) {
      throw new Error("Filme not found!");
    }
    res.status(200).json(filme);
  } catch (error) {
    next(error);
  }
});

router.post("/", isAuthenticated, async (req, res, next) => {
  try {
    const newFilme = await Filme.create({
      ...req.body,
      createdBy: req.tokenPayload.userId,
    });
    res.status(201).json(newFilme);
  } catch (error) {
    next(error);
  }
});

router.put("/:filmeId", isAuthenticated, async (req, res, next) => {
  const { filmeId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(filmeId)) {
    return next(new Error("Invalid ID"));
  }

  try {
    const updatedFilme = await Filme.findByIdAndUpdate(filmeId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedFilme) {
      return next(new Error("Filme not found"));
    }
    res.status(200).json(updatedFilme);
  } catch (error) {
    next(error);
  }
});

router.delete("/:filmeId", isAuthenticated, async (req, res, next) => {
  const { filmeId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(filmeId)) {
    return next(new Error("Invalid ID"));
  }

  try {
    const filmeToDelete = await Filme.findById(filmeId);
    if (!filmeToDelete) {
      return next(new Error("Filme not found"));
    }
    if (filmeToDelete.createdBy === req.tokenPayload.userId) {
      await Filme.findByIdAndDelete(filmeId);
      res.status(204).send();
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
