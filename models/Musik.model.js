const mongoose = require("mongoose");

const musikSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  album: { type: String },
  releaseYear: { type: Number },
  genre: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Musik = mongoose.model("Musik", musikSchema);

module.exports = Musik;
