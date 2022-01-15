const express = require("express");
const { algo } = require("../algo/algo");
const router = express.Router();
const PromotersSchema = require('../models/Promoters');

router.get("/adtostream", async (req, res) => {
  const properties = {
    area: req.body.area,
    promoterID: req.body.promoterID,
  };
  try {
    const adToStream = await algo(properties);
    res.send(adToStream);
  } catch (err) {
    console.error(err);
  }
});

router.put("/chargeAdvertiser/", async (req, res) => {
  const { bid, advertiserID } = req.body;
  try {
    const response = chargeAdvertiser(bid, advertiserID);
    //if good - log
  } catch (err) {
    console.error(err);
  }
});



module.exports = router;
