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

const router = express.Router();

router.use(logger);

router.get("/high-ratings", getHighRatings, getAllMovies);
router.get("/movie-stats", getMovieStats);
router.get("/movies-by-genre", getMovieByGenres);
router.get("/", getAllMovies);
router.post("/", validateBody, postMovie);
router.get("/:id", getMovieById);
router.patch("/:id", patchMovieById);
router.use(logger2);
router.delete("/:id", deleteMovieById);

module.exports = router;
