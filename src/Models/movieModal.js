const mongoose = require("mongoose");

const moviesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    unique: true,
    trim: true,
  },
  description: { type: String, default: null, trim: true },
  duration: {
    type: Number,
    required: [true, "Duration is required"],
    trim: true,
  },
  ratings: { type: Number, default: 1.0, trim: true },
  totalRating: {
    type: Number,
  },
  releaseYear: {
    type: Number,
    required: [true, "Release year is required"],
  },
  releaseDate: {
    type: String,
  },
  createAt: {
    type: Date,
    default: Date.now(),
    select: false, // không select ( sử dụng trong trường hợp trường là private ví dụ như mật khẩu của người dùng )
  },
  genres: {
    type: [String],
    required: [true, "Genres is required"],
  },
  directors: {
    type: [String],
    required: [true, "Directors is required"],
  },
  coverImage: {
    type: String,
    required: [true, "Cover image is required"],
  },
  actors: {
    type: [String],
    required: [true, "Actor is required"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
  },
});

const Movie = mongoose.model("Movie", moviesSchema);

module.exports = Movie;
