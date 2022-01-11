const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());

app.listen(process.env.PORT, process.env.HOST, () => {
  console.log(
    "Running AdMyCar server on " + process.env.HOST + ":" + process.env.PORT
  );
});
