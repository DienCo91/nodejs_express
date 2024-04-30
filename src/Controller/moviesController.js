const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

exports.logger = (req, res, next) => {
  console.log("Middleware called 1");
  req.requestAt = new Date().toISOString();
  next();
};
exports.logger2 = (req, res, next) => {
  console.log("Middleware called 2");
  next();
};

exports.checkId = (req, res, next, value) => {
  const movie = movies.find((m) => m.id === parseInt(value));
  if (!movie) {
    return res.status(404).json({
      message: "Movie not found",
      status: "failed",
    });
  }

  next();
};

exports.validateBody = (req, res, next) => {
  console.log(req.body);
  if (!req.body.data.name || !req.body.data.releaseYear) {
    return res.status(400).json({ status: "failed" });
  }
  next();
};

const movies = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../db/movie.json"))
);

exports.getAllMovies = (req, res) => {
  res.status(200).json({
    status: "success",
    count: movies.length,
    requestAt: req.requestAt,
    data: {
      movies: movies,
    },
  });
};

exports.postMovie = (req, res) => {
  const newMovie = { id: movies[movies.length - 1].id + 1, ...req.body.data };
  fs.writeFileSync(
    path.join(__dirname, "../db/movie.json"),
    JSON.stringify([...movies, newMovie])
  );
  res.status(201).json({
    status: "Created",
    message: "Success",
    data: { ...newMovie },
  });
};
exports.getMovieById = (req, res) => {
  const filterById = Number(req.params.id);
  const dataFilter = movies.find((item) => {
    return filterById === item.id;
  });
  if (!dataFilter) {
    res.status(404).json({
      status: "Not Found",
      message: `Id move ${req.params.id} not found`,
    });
  }
  res.status(200).json({
    status: "Ok",
    message: "Success",
    data: { ...dataFilter },
  });
};

exports.patchMovieById = (req, res) => {
  const dataFilter = movies.map((item) => {
    if (item.id === Number(req.params.id)) {
      return { ...item, ...req.body };
    }
    return item;
  });
  fs.writeFileSync(
    path.join(__dirname, "../db/movie.json"),
    JSON.stringify(dataFilter)
  );
  return res.status(200).json({
    status: "OK",
    message: "Success",
    data: { ...dataFilter.find((item) => item.id === Number(req.params.id)) },
  });
};

exports.deleteMovieById = (req, res) => {
  const newData = movies.filter((item) => item.id !== Number(req.params.id));

  if (newData.length === movies.length) {
    return res.status(404).json({
      status: "faild",
      message: "Movie id not found",
    });
  }
  fs.writeFileSync(
    path.join(__dirname, "../db/movie.json"),
    JSON.stringify(newData)
  );
  console.log(newData);
  return res.status(204).json({
    // khi status la 204 thi se ko tra ve data du co them data vao response
    status: "OK",
    message: "Delete Success",
  });
};
