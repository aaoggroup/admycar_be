const express = require("express");
const router = express.Router();
const CompaniesSchema = require("../models/Companies");
const CampaignsSchema = require("../models/Campaigns");
const { cloudinary, uploadToCloudinary } = require("../config/cloudinary");

router.post("/addCampaign", async (req, res) => {
  try {
    const imageURL = await uploadToCloudinary(req.body.asset);
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
// @desc        Get all companies
// @route       GET /companies
// @access      Private
// need middleware to authenticate admin
router.get('/', async(req,res) => {
  try {
    const companies = await CompaniesSchema.find().populate({
        path: 'campaigns',
        select: 'first_name last_name email company_name company_number company_vat_id'
    });

    res.status(200).json({
        success: true,
        data: companies
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
// @route       GET /companies/:id
// @access      Private
router.get('/:id', async(req,res) => {
  try {
    const company = await CompaniesSchema.find(req.params.id);

    res.status(200).json({
        success: true,
        data: company
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
        success: false,
        data: 'Server error'
    });
  }
})

// @desc        Create new company
// @route       POST /companies
// @access      public
router.post('/', async(req,res) => {
  try {
    const company = await CompaniesSchema.create(req.body);

    res.status(200).json({
        success: true,
        data: company
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
        success: false,
        data: 'Server error'
    });
  }
})

// @desc        Update company
// @route       PUT /companies/:id
// @access      Private
router.put('/:id', async(req,res) => {
  try {
    const company = await CompaniesSchema.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: company
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
        success: false,
        data: 'Server error'
    });
  }
})

// @desc        Delete company
// @route       delete /companies/:id
// @access      Private
router.delete("/:id", async (req, res) => {
  try {
    const company = await PromotersSchema.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: company,
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
