const express = require("express");

const path = require("path");
const Movie = require("../Models/movieModal");
const ApiFeatures = require("../Utils/ApiFeatures");

exports.logger = (req, res, next) => {
  console.log("Middleware called 1");
  req.requestAt = new Date().toISOString();
  next();
};
exports.logger2 = (req, res, next) => {
  console.log("Middleware called 2");
  next();
};

exports.validateBody = (req, res, next) => {
  next();
};
exports.getHighRatings = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratings";
  next();
};
exports.getAllMovies = async (req, res) => {
  try {
    const totalDocument = await Movie.countDocuments();
    const feature = new ApiFeatures(Movie.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate(totalDocument);
    console.log(123);

    const movies = await feature.query;

    res.status(200).json({
      status: "OK",
      length: movies.length,
      requestAt: req.requestAt,
      data: movies,
    });
  } catch (err) {
    res.status(400).json({ status: "Bad Request", message: err.message });
  }
};

exports.postMovie = async (req, res) => {
  // const movieItem = new Movie({});
  // movieItem.save().then(() => {});
  try {
    const movie = await Movie.create(req.body);
    res.status(200).json({
      status: "OK",
      data: {
        movie: movie,
      },
    });
  } catch (err) {
    res.status(400).json({ status: "Bad Request", message: err.message });
  }
};
exports.getMovieById = async (req, res) => {
  try {
    console.log(req.params.id);
    const movie = await Movie.findById(req.params.id);
    // const movie = await Movie.findOne({ name: req.params.id });
    res.status(200).json({
      status: "OK",
      data: {
        movie: movie,
      },
    });
  } catch (err) {
    res.status(400).json({ status: "Bad Request", message: err.message });
  }
};

exports.patchMovieById = async (req, res) => {
  try {
    // const movie = await Movie.updateOne(
    //   { _id: req.params.id },
    //   { $set: req.body }
    // ); // thay doi cac truong co trong req.body
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true, // sử dụng để validate dữ liệu khi cập nhật data ( trả ra thông báo sai khi không thỏa mãn điều kiện của trường )
    });
    // {new: true} tra ve data sau khi lam moi
    res.status(200).json({
      status: "OK",
      data: movie,
    });
  } catch (err) {
    res.status(400).json({ status: "Bad Request", message: err.message });
  }
};

exports.deleteMovieById = async (req, res) => {
  try {
    const movieDeleted = await Movie.deleteOne({ _id: req.params.id });
    res.status(204).json({
      status: "OK",
      data: movieDeleted,
    });
  } catch (err) {
    res.status(400).json({ status: "Bad Request", message: err.message });
  }
};

exports.getMovieStats = async (req, res) => {
  try {
    const stats = await Movie.aggregate([
      { $match: { ratings: { $gt: 8, $lt: 20 } } },
      {
        $group: {
          _id: "$duration", // group theo nam
          maxRatings: { $max: "$ratings" },
          avgRatings: { $avg: "$ratings" },
          maxPrice: { $max: "$price" },
          minPrice: { $min: "$price" },
          avgPrice: { $avg: "$price" },
          totalPrice: { $sum: "$price" },
          movieCount: { $sum: 1 },
        }, // cho vào 1 nhóm với điều kiện cụ thể thông qua ID và lấy được thông số của từng nhóm
      },
      { $sort: { avgPrice: 1 } }, //sort các nhóm
      { $match: { maxPrice: { $gt: 13 } } },
    ]);

    res.status(200).json({
      status: "OK",
      data: stats,
    });
  } catch (err) {
    res.status(400).json({ status: "Bad Request", message: err.message });
  }
};

exports.getMovieByGenres = async (req, res) => {
  try {
    const byGenres = await Movie.aggregate([
      {
        $unwind: { path: "$actors" },
      },
      {
        $group: {
          _id: "$actors",
          totalPrice: { $sum: "$price" },
          movies: { $push: "$name" },
        },
      },
      { $addFields: { genre: "$_id" } },
      { $project: { _id: 0 } },
      { $sort: { _id: -1 } },
    ]);
    res.status(200).json({
      status: "OK",
      data: byGenres,
    });
  } catch (err) {}
};
