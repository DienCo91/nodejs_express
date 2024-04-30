const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, "config.env") });

const app = require("./index");
// console.log(app.get("env"));
// console.log(process.env);
mongoose
  .connect(process.env.CONN_STR, {
    useNewUrlParser: true,
  })
  .then((connection) => {
    // console.log(connection);
    console.log("Successfully connected");
  })
  .catch((error) => {
    console.log(error);
  });

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
