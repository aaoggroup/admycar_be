const express = require("express");
const { algo } = require("../algo/algo");
const router = express.Router();
const CampaignsSchema = require("../models/Campaigns");
const { cloudinary, uploadToCloudinary } = require("../config/cloudinary");
require("dotenv").config();
const { auth } = require("../middleware/auth");

// @desc        Get all campaigns
// @route       GET /campaigns
// @access      Private
// need middleware to authenticate Company
router.get("/", auth, async (req, res) => {
  const { type } = req.user;
  if (type !== "Company") {
    return res.status(400).json({
      success: false,
      data: "Not Authorized",
    });
  }
  try {
    const campaigns = await CampaignsSchema.find();

    res.status(200).json({
      success: true,
      data: campaigns,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      data: "Server error",
    });
  }
});

// @desc        Get all campaigns by company_id
// @route       GET /campaigns/:company_id
// @access      Private
// need middleware to authenticate Company
router.get("/:company_id", auth, async (req, res) => {
  const { type, company_id: comp_id } = req.user;
  const { company_id } = req.params;
  if (type !== "Company" || comp_id !== company_id) {
    return res.status(400).json({
      success: false,
      data: "Not Authorized",
    });
  }
  try {
    const campaigns = await CampaignsSchema.find({
      company_id: company_id,
    });

    return res.status(200).json({
      success: true,
      count: campaigns.length,
      data: campaigns,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      data: "Server error",
    });
  }
});

// @desc        Get single campaign
// @route       GET /campaigns/:campaign_id/:company_id
// @access      Private
router.get("/:campaign_id/:company_id", auth, async (req, res) => {
  const { type, company_id: comp_id } = req.user;
  const { campaign_id, company_id } = req.params;
  if (type !== "Company" || comp_id !== company_id) {
    return res.status(400).json({
      success: false,
      data: "Not Authorized",
    });
  }
  try {
    const campaign = await CampaignsSchema.findById(campaign_id);
    console.log(campaign);
    res.status(200).json({
      success: true,
      data: campaign,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      data: "Server error",
    });
  }
});

// @desc        Create new campaign by company
// @route       POST /campaigns/:company_id
// @access      Private
router.post("/:company_id", auth, async (req, res) => {
  const { type, company_id: comp_id } = req.user;
  const { company_id } = req.params;
  const { asset, ...rest } = req.body;
  console.log(req.body);
  if (type !== "Company" || comp_id !== company_id) {
    return res.status(400).json({
      success: false,
      data: "Not Authorized",
    });
  }
  try {
    const cloudRes = await uploadToCloudinary(asset);
    console.log({ ...rest, asset: cloudRes });
    const campaign = await CampaignsSchema.create({ ...rest, asset: cloudRes });

    res.status(200).json({
      success: true,
      data: campaign,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      data: "Server error",
    });
  }
});

// @desc        Update campaign
// @route       PUT /campaigns/:campaign_id/:company_id
// @access      Private
router.put("/:campaign_id/:company_id", auth, async (req, res) => {
  const { type, company_id: comp_id } = req.user;
  const { campaign_id, company_id } = req.params;
  console.log(req.params);
  if (type !== "Company" || comp_id !== company_id) {
    return res.status(400).json({
      success: false,
      data: "Not Authorized",
    });
  }
  if (req.body.asset.includes("dmnpnnrro")) delete req.body.asset;
  else req.body.asset = await uploadToCloudinary(req.body.asset);
  console.log(req.body);
  try {
    const campaign = await CampaignsSchema.findByIdAndUpdate(
      campaign_id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      success: true,
      data: campaign,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      data: "Server error",
    });
  }
});

// @desc        Update campaign assets
// @route       PUT /campaigns/asset/:campaign_id/:company_id
// @access      Private
router.put("/asset/:campaign_id/:company_id", auth, async (req, res) => {
  const { type, company_id: comp_id } = req.user;
  const { campaign_id, company_id } = req.params;
  const { asset } = req.body;
  if (type !== "Company" || comp_id !== company_id) {
    return res.status(400).json({
      success: false,
      data: "Not Authorized",
    });
  }
  try {
    const cloudRes = await uploadToCloudinary(asset);
    const campaign = await CampaignsSchema.findByIdAndUpdate(
      campaign_id,
      { asset: cloudRes },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      success: true,
      data: campaign,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      data: "Server error",
    });
  }
});

module.exports = router;
