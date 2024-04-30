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
} = require("../../Controller/moviesController");

const router = express.Router();
// post request
/* `router.use(express.json());` is setting up middleware in the Express router to parse incoming
requests with JSON payloads. This middleware function parses incoming request bodies and makes the
parsed JSON data available on the `req.body` property of the request object. This allows the
application to handle JSON data in the request body easily. */
router.use(express.json());

router.use(logger);

router.get("/", getAllMovies);
router.post("/", validateBody, postMovie);
router.get("/:id", getMovieById);
router.patch("/:id", patchMovieById);
router.use(logger2);
router.delete("/:id", deleteMovieById);

module.exports = router;
