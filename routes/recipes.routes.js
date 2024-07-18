const { default: mongoose } = require('mongoose')
const Recipe = require('../models/Recipe.model')
const { isAuthenticated } = require('../middlewares/route-guard.middleware')

const router = require('express').Router()
// All routes starts with /api/recipes
router.get('/', async (req, res, next) => {
  try {
    const recipesData = await Recipe.find().populate('createdBy', 'username email')
    res.json(recipesData)
  } catch (error) {
    next(error)
  }
})

router.get('/:recipeId', async (req, res, next) => {
  const { recipeId } = req.params
  if (!mongoose.isValidObjectId(recipeId)) {
    return next(new Error('Invalid ID'))
  }

  try {
    const recipe = await Recipe.findById(recipeId)
    if (!recipe) {
      throw new Error('Recipe not found!')
    }
    res.status(200).json(recipe)
  } catch (error) {
    next(error)
  }
})

router.post('/', isAuthenticated, async (req, res, next) => {
  try {
    const newRecipe = await Recipe.create({ ...req.body, createdBy: req.tokenPayload.userId })
    res.status(201).json(newRecipe)
  } catch (error) {
    next(error)
  }
})

router.put('/:recipeId', isAuthenticated, async (req, res, next) => {
  const { recipeId } = req.params

  if (!mongoose.Types.ObjectId.isValid(recipeId)) {
    return next(new Error('Invalid ID'))
  }

  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(recipeId, req.body, {
      new: true,
      runValidators: true,
    })

    if (!updatedRecipe) {
      return next(new Error('Recipe not found'))
    }
    res.status(200).json(updatedRecipe)
  } catch (error) {
    next(error)
  }
})

router.delete('/:recipeId', isAuthenticated, async (req, res, next) => {
  const { recipeId } = req.params

  if (!mongoose.Types.ObjectId.isValid(recipeId)) {
    return next(new Error('Invalid ID'))
  }

  try {
    const recipeToDelete = await Recipe.findById(recipeId)
    if (!recipeToDelete) {
      return next(new Error('Recipe not found'))
    }
    if (recipeToDelete.createdBy === req.tokenPayload.userId) {
      await Recipe.findByIdAndDelete(recipeId)
      res.status(204).send()
    }
  } catch (error) {
    next(error)
  }
})

module.exports = router
