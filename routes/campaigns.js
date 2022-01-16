const express = require("express");
const { algo } = require("../algo/algo");
const router = express.Router();
const CampaignsSchema = require("../models/Campaigns");
const { cloudinary, uploadToCloudinary } = require("../config/cloudinary");
require("dotenv").config();

// @desc        Get all campaigns
// @route       GET /campaigns
// @access      Private
// need middleware to authenticate admin
router.get("/", async (req, res) => {
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
// need middleware to authenticate admin
router.get("/:company_id", async (req, res) => {
  const { company_id } = req.params;
  try {
    if (company_id) {
      const campaigns = await CampaignsSchema.find({
        company_id: company_id,
      });
      console.log(campaigns);

      return res.status(200).json({
        success: true,
        count: campaigns.length,
        data: campaigns,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      data: "Server error",
    });
  }
});

// @desc        Get single campaign
// @route       GET /campaigns/:id
// @access      Private
router.get("/:id", async (req, res) => {
  try {
    const campaign = await CampaignsSchema.find(req.params.id);

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
router.post("/:company_id", async (req, res) => {
  // if  type === 'Company
  try {
    const campaign = await CampaignsSchema.create(req.body);

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
// @route       PUT /campaigns/:id
// @access      Private
router.put("/:id", async (req, res) => {
  // if company_id === id in auth then =>
  try {
    const campaign = await CampaignsSchema.findByIdAndUpdate(
      req.params.id,
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

module.exports = router;
