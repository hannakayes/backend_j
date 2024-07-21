const mongoose = require("mongoose");

const bingoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Bingo = mongoose.model("Bingo", bingoSchema);

module.exports = Bingo;
