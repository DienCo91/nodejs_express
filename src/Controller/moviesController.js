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
    const movies = await Movie.find({
      $and: [
        { ratings: { $lt: 3 } },
        { $expr: { $gt: [{ $strLenCP: "$name" }, 4] } },
      ],
    });
    res.status(200).json({
      status: "OK",
      data: movies,
      length: movies.length,
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
    // const movie = await Movie.findById(req.params.id);
    const movie = await Movie.findOne({ name: req.params.id });
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

exports.patchMovieById = (req, res) => {};

exports.deleteMovieById = (req, res) => {};
