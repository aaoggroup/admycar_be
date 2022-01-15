const express = require("express");
const router = express.Router();

router.post("/addCampaign", async (req, res) => {
  console.log(req.body);
  const campaignsProperties = {
    campaign_name: req.body.campaign_name,
    advertiser_id: req.body.advertiser_id,
    asset: req.body.asset,
    current_bid: req.body.current_bid,
    daily_budget: req.body.daily_budget,
    total_budget: req.body.total_budget,
    area: req.body.area,
    date_created: Date.now(),
  };
  try {
    const response = addCampaignToDB(campaignsProperties);
    //work with response
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
