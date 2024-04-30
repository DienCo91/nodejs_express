const express = require("express");
const router = express.Router();

router.get("/user/:id", async (req, res, next) => {
  //   const user = await getUserById(req.params.id);
  res.send("22");
});

module.exports = router;
