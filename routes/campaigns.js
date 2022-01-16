const express = require("express");
const { algo } = require("../algo/algo");
const router = express.Router();
const CampaignsSchema = require('../models/Campaigns');

// @desc        Get all campaigns
// @route       GET /campaigns
// @access      Private
// need middleware to authenticate admin
router.get('/', async(req,res) => {
  try {
    const campaigns = await CampaignsSchema.find().populate({
        path: 'campaigns',
        select: 'campaign_name company_id asset current_bid daily_budget total_budget today_spent area'
    });

    res.status(200).json({
        success: true,
        data: campaigns
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
        success: false,
        data: 'Server error'
    });
  }
})

// @desc        Get single campaign
// @route       GET /campaigns/:id
// @access      Private
router.get('/:id', async(req,res) => {
  try {
    const campaign = await CampaignsSchema.find(req.params.id);

    res.status(200).json({
        success: true,
        data: campaign
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
        success: false,
        data: 'Server error'
    });
  }
})

// @desc        Create new campaign
// @route       POST /campaigns
// @access      Private
router.post('/', async(req,res) => {
  try {
    const campaign = await CampaignsSchema.create(req.body);

    res.status(200).json({
        success: true,
        data: campaign
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
        success: false,
        data: 'Server error'
    });
  }
})

// @desc        Update campaign
// @route       PUT /campaigns/:id
// @access      Private
router.put('/:id', async(req,res) => {
  try {
    const campaign = await CampaignsSchema.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: campaign
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
        success: false,
        data: 'Server error'
    });
  }
})

module.exports = router;