const express = require("express");

const path = require("path");
const Movie = require("../Models/movieModal");

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

exports.getAllMovies = async (req, res) => {
  try {
    // const movies = await Movie.find({
    //   $and: [
    //     { ratings: { $lt: 3 } },
    //     { $expr: { $gt: [{ $strLenCP: "$name" }, 4] } },
    //   ],
    // });
    // const { duration, ratings } = req.query;
    // const movies = await Movie.find()
    //   .where("duration")
    //   .gte(duration)
    //   .where("ratings")
    //   .lte(ratings);

    // need use query
    // http://localhost:8000/movie/v1?ratings[gt]=1&&price[gt]=9.99&&duration=169

    let filter = JSON.stringify(req.query).replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    filter = JSON.parse(filter);
    console.log(filter);
    if (req.query.sort) {
      delete filter.sort;
    }
    let query = Movie.find(filter);

    //sort
    //http://localhost:8000/movie/v1/?sort=-price,ratings
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" "); // 'price,ratings'
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createAt");
    }
    const movies = await query;

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
      runValidators: true,
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
