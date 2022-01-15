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

// @desc        Get all promoters
// @route       GET /promoters
// @access      Private/Admin
// need middleware to authenticate admin
router.get('/', async(req,res) => {
  try {
    const promoters = await PromotersSchema.find().populate({
        path: 'promoters',
        select: 'first_name last_name email'
    });

    res.status(200).json({
        success: true,
        data: promoters
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
        success: false,
        data: 'Server error'
    });
  }
})

// @desc        Get single promoter
// @route       GET /promoters/:id
// @access      Private
router.get('/:id', async(req,res) => {
  try {
    const promoter = await PromotersSchema.find(req.params.id);

    res.status(200).json({
        success: true,
        data: promoter
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
        success: false,
        data: 'Server error'
    });
  }
})

// @desc        Create new promoter
// @route       POST /promoters
// @access      Public
router.post('/', async(req,res) => {
  try {
    const promoter = await PromotersSchema.create(req.body);

    res.status(200).json({
        success: true,
        data: promoter
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
        success: false,
        data: 'Server error'
    });
  }
})

// @desc        Update promoter
// @route       PUT /promoters/:id
// @access      Private
router.put('/:id', async(req,res) => {
  try {
    const promoter = await PromotersSchema.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: promoter
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
        success: false,
        data: 'Server error'
    });
  }
})

// @desc        Delete promoter
// @route       delete /promoters/:id
// @access      Private
router.delete('/:id', async(req,res) => {
  try {
    const promoter = await PromotersSchema.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        data: promoter
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
