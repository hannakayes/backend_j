const { Schema, model, Types } = require("mongoose");

const filmeSchema = new Schema(
  {
    englishTitle: {
      type: String,
      required: [true, "English title is required."],
      trim: true,
    },
    originalTitle: {
      type: String,
      required: [true, "Original title is required."],
      trim: true,
    },
    language: {
      type: String,
      required: [true, "Language is required."],
    },
    genre: {
      type: String,
      required: [true, "Genre is required."],
    },
    description: {
      type: String,
    },
    yearOfRelease: {
      type: Number,
      required: [true, "Year of release is required."],
    },
    image: {
      type: String,
    },
    link: {
      type: String,
      required: [true, "Link to movie streaming service is required."],
    },
    createdBy: {
      type: Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Filme = model("Filme", filmeSchema);

module.exports = Filme;
