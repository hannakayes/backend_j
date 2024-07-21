const { Schema, model, Types } = require("mongoose");

const rezeptSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required."],
      trim: true,
    },
    createdBy: {
      type: Types.ObjectId,
      required: true,
      ref: "User",
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
      enum: ["Easy", "Okay", "Hard"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Rezept = model("Rezept", rezeptSchema);

module.exports = Rezept;
