const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const promotersRoute = require("./routes/promoters");
const advertisersRoute = require("./routes/advertisers");

connectDB();

const app = express();
app.use(express.json());

app.use(cors());
app.use("/promoters", promotersRoute);
app.use("/advertisers", advertisersRoute);

app.listen(process.env.PORT, process.env.HOST, () => {
  console.log(
    "Running AdMyCar by AAOG server on " +
      process.env.HOST +
      ":" +
      process.env.PORT
  );
});
