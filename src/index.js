const path = require("path");

// route
const animal = require("./route/animal");
const datetime = require("./route/middleware");
const handleError = require("./route/handleError");
const movie = require("./route/v1/movie");
const express = require("express");
const { engine } = require("express-handlebars");
const morgan = require("morgan");
const app = express();

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

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

module.exports = app;
