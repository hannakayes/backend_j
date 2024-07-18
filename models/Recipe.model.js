const { Schema, model, Types } = require('mongoose')

const recipeSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required.'],
      trim: true,
    },
    createdBy: {
      type: Types.ObjectId,
      required: true,
      ref: 'User',
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
