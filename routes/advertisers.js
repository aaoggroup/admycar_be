const express = require("express");
const router = express.Router();
const CompaniesSchema = require("../models/Companies");
const CampaignsSchema = require("../models/Campaigns");
const { cloudinary, uploadToCloudinary } = require("../config/cloudinary");

router.post("/addCampaign", async (req, res) => {
  console.log(req.body);
  try {
    const imageURL = await uploadToCloudinary(req.body.asset);
    console.log(imageURL);
    const campaignsProperties = {
      campaign_name: req.body.campaign_name,
      company_id: req.body.company_id,
      asset: imageURL,
      current_bid: req.body.current_bid,
      daily_budget: req.body.daily_budget,
      total_budget: req.body.total_budget,
      area: req.body.area,
      date_created: String(Date.now()),
    };

    const response = await CampaignsSchema.create(campaignsProperties);
    console.log(response);
    res.send(response);
  } catch (err) {
    console.error(err);
  }
});

const addCampaignToDB = async () => {
  const response = await Companies.create();
};

module.exports = router;
