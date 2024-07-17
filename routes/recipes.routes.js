const { default: mongoose } = require('mongoose')
const Recipe = require('../models/Recipe.model')

const router = require('express').Router()
// All routes starts with /api/recipes
router.get('/', async (req, res, next) => {
  try {
    const recipesData = await Recipe.find()
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

router.post('/', async (req, res, next) => {
  try {
    const newRecipe = await Recipe.create(req.body)
    res.status(201).json(newRecipe)
  } catch (error) {
    next(error)
  }
})

router.put('/:recipeId', async (req, res, next) => {
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

router.delete('/:recipeId', async (req, res, next) => {
  const { recipeId } = req.params

  if (!mongoose.Types.ObjectId.isValid(recipeId)) {
    return next(new Error('Invalid ID'))
  }

  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(recipeId)
    if (!deletedRecipe) {
      return next(new Error('Recipe not found'))
    }
    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

module.exports = router
