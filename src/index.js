const path = require("path");

// route
const animal = require("./route/animal");
const datetime = require("./route/middleware");
const handleError = require("./route/handleError");
const movie = require("./route/v1/movie");
const express = require("express");

const morgan = require("morgan");
const cors = require("cors");
const CustomError = require("./Utils/CustomError");

const handleErrorGlobal = require("./Controller/errorController");
const app = express();
app.use(cors());

app.use("/animal", animal);
app.use("/datetime", datetime);
app.use("/error", handleError);
app.use("/movie/v1", movie);

app.use(express.static(path.join(__dirname, "public")));
app.use(morgan("dev"));

app.use(express.json());

app.post("/", (req, res) => {
  res.send("home");
});
// regex
app.get("/ab?cd", (req, res) => {
  // ?b có nghĩa là b có thể xuất hiện 1 hoặc 0 lần
  res.send("ab?cd");
});
app.get("/ab+cd", (req, res) => {
  res.send("ab+cd");
});
app.get("/ab*cd", (req, res) => {
  // * co the la bat cu chuoi nao
  res.send("ab*cd");
});
// router
app.get("/users/:userId(\\d+)/books/:bookId(\\d+)", (req, res) => {
  res.send(req.params);
});

app.get("/users/:from-:to", (req, res) => {
  res.send(req.params);
});

// Route handlers

// use next
// ex1
app.get(
  "/examples/b",
  (req, res, next) => {
    console.log("Examples");

    next(); // dung lenh nay de goi den ham callback tiep theo
  },
  (req, res) => {
    res.send("Hello World!");
  }
);
// ex2
const cb1 = (req, res, next) => {
  console.log("CB1");

  next();
};
const cb2 = (req, res, next) => {
  console.log("CB2");

  next();
};

const cb3 = (req, res) => {
  console.log("CB3");
  res.send("CB3");
};

app.get("/examples/c", [cb1, cb2, cb3]);

// ex3
const cb0 = function (req, res, next) {
  console.log("CB0");
  next();
};

const cb4 = function (req, res, next) {
  console.log("CB4");
  next();
};

app.get(
  "/example/d",
  [cb0, cb4],
  (req, res, next) => {
    console.log("the response will be sent by the next function ...");
    next();
  },
  (req, res) => {
    res.send("Hello from D!");
  }
);
// download
app.get("/download", (req, res) => {
  res.download(`${path.join(__dirname, "public")}/assets/img.webp`);
});

// app.route
app
  .route("/item")
  .get((req, res) => {
    res.send("Hello from get");
  })
  .post((req, res) => {
    res.send("Hello from post");
  });

app.all("*", (req, res, next) => {
  const err = new CustomError(`Not Found ${req.originalUrl} Router`, 404);
  next(err || 2); // neu truyen doi so vao day Express se hieu la co 1 loi
});

// neu co loi se truc tiep vao ham nay ma bo qua cac middleware khac (thuong de o cuoi cua middleware)
app.use(handleErrorGlobal);
module.exports = app;
