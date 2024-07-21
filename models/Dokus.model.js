const mongoose = require("mongoose");

const dokusSchema = new mongoose.Schema({
  title: { type: String, required: true },
  director: { type: String, required: true },
  releaseYear: { type: Number },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Dokus = mongoose.model("Dokus", dokusSchema);

module.exports = Dokus;
