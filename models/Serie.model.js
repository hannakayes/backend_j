const mongoose = require("mongoose");

const serienSchema = new mongoose.Schema({
  title: { type: String, required: true },
  creator: { type: String, required: true },
  seasons: { type: Number },
  genre: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Serien = mongoose.model("Serien", serienSchema);

module.exports = Serien;
