const express = require("express");
const router = express.Router();

router.use((req, res, next) => {
  console.log("Time: ", Date.now()); //1

  next();
});

router.get("/:name", (req, res) => {
  console.log("name animal"); //2
  res.send(req.params.name); //3
});

const getAnimalId = (req, res, next) => {
  console.log(new Date());
  next();
};

router.use("/:id(\\d+)", getAnimalId);

router.get(
  "/:id(\\d+)",
  (req, res, next) => {
    req.name = "minh";
    console.log("get2");
    if (req.params.id === "2") {
      next("route"); // bo qua cac lenh con lai de di chuyen den lenh o router khac voi param tuong tu
    }
    next();
  },
  (req, res) => {
    res.send(req.params);
  }
);
router.get("/:id(\\d+)", (req, res, next) => {
  res.send(req.name);
});

router.use("/error/error", (err, req, res, next) => {
  // neu them err vào agr thì hàm sẽ chạy khi có lỗi còn ko có lỗi sẽ thực hiện luôn mà ko thông qua use
  next();
  res.send("Something broke!");
});
router.get("/error/error", (req, res) => {
  res.send("ssssss");
});
module.exports = router;
