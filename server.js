const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const promotersRoute = require("./routes/promoters");
const companiesRoute = require("./routes/companies");
const campaignsRoute = require("./routes/campaigns");
connectDB();
const { algo } = require("./algo/algo");

const app = express();
app.use(cors());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

app.use("/promoters", promotersRoute);
app.use("/companies", companiesRoute);
app.use("/campaigns", campaignsRoute);

app.listen(process.env.PORT || 5000);
