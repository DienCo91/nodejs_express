const mongoose = require("mongoose");

const moviesSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Name is required"], unique: true },
  description: { type: String, default: null },
  duration: { type: Number, required: [true, "Duration is required"] },
  ratings: { type: Number, default: 1.0 },
});

const Movie = mongoose.model("Movie", moviesSchema);

module.exports = Movie;
