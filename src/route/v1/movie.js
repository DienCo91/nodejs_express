const express = require("express");
const {
  getAllMovies,
  postMovie,
  getMovieById,
  patchMovieById,
  logger2,
  deleteMovieById,
  checkId,
  validateBody,
  logger,
  getHighRatings,
  getMovieStats,
  getMovieByGenres,
} = require("../../Controller/moviesController");
const { protectRouter } = require("../../Controller/authController");

const router = express.Router();

// router.use(protectRouter);

router.get("/high-ratings", [getHighRatings, protectRouter], getAllMovies);
router.get("/movie-stats", getMovieStats);
router.get("/movies-by-genre", getMovieByGenres);
router.get("/", getAllMovies);
router.post("/", validateBody, postMovie);
router.get("/:id", getMovieById);
router.patch("/:id", patchMovieById);
router.delete("/:id", deleteMovieById);

module.exports = router;
