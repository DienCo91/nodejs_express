const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, "config.env") });
// xu li loi. Vi du in ra man hinh bien chua duoc khai bao : console.log(x);
// phai de len truoc app vi se bat loi o sau doan code nay
process.on("uncaughtException", (error) => {
  console.log("🚀 ~ process.on ~ error:", error.message, error.name);
  server.close(() => {
    process.exit(1);
  });
});

const app = require("./index");
// console.log(app.get("env"));
// console.log(process.env.NODE_ENV);
mongoose
  .connect(process.env.CONN_STR, {
    useNewUrlParser: true,
  })
  .then((connection) => {
    // console.log(connection);
    console.log("Successfully connected");
  });

const server = app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
// xu li khi server loi
process.on("unhandledRejection", (error) => {
  console.log("🚀 ~ unhandledRejection ~ error:", error.name);
  server.close(() => {
    process.exit(1);
  });
});
