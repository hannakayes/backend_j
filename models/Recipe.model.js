const { Schema, model } = require('mongoose')

const recipeSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required.'],
      trim: true,
    },
    createdBy: {
      type: String,
      trim: true,
      default: 'Anonymous',
    },
    instructions: {
      type: [String],
      required: true,
    },
    ingredients: {
      type: [String],
      required: true,
    },
    difficultyLevel: {
      type: String,
      enum: ['Easy', 'Okay', 'Hard'],
      required: true,
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
)

const Recipe = model('Recipe', recipeSchema)

module.exports = Recipe
