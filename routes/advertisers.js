const express = require("express");
const router = express.Router();
const AdvertisersSchema = require('../models/Advertisers');
const CampaignsSchema = require('../models/Campaigns');
const { cloudinary, uploadToCloudinary } = require('../config/cloudinary');

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
    const response = await CampaignsSchema.create(campaignsProperties);
    console.log(response);
    //work with response
  } catch (err) {
    console.error(err);
  }
});

const addCampaignToDB = async () => {
  const response = await Advertisers.create()
}

module.exports = router;
