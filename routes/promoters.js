const express = require("express");
const { algo } = require("../algo/algo");
const router = express.Router();
const PromotersSchema = require("../models/Promoters");
const CompaniesSchema = require("../models/Companies");
const CampaignsSchema = require("../models/Campaigns");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { auth } = require("../middleware/auth");

router.post("/start-stream/:promoter_id", auth, async (req, res) => {
  const { promoter_id } = req.params;
  if (promoter_id !== req.user.promoter_id) {
    return res.status(400).json({
      success: false,
      data: "Not Authorized",
    });
  }
  const properties = {
    area: req.body.area,
    promoterID: req.body.promoterID,
  };
  try {
    const adToStream = await algo(properties);
    if (adToStream === 0) res.status(201).send("No ad to stream");
    else res.status(200).send(adToStream);
  } catch (err) {
    console.error(err);
  }
});

router.put("/charge_company/:company_id/:promoter_id", auth, async (req, res) => {
  const { promoter_id, company_id } = req.params;
  const { bid, companyID, campaignID } = req.body;
  if (promoter_id !== req.user.promoter_id || companyID !== company_id) {
    return res.status(400).json({
      success: false,
      data: "Not Authorized",
    });
  }
  try {
    const company = await CompaniesSchema.findById({ _id: companyID });
    const response = await CompaniesSchema.findByIdAndUpdate(
      { _id: companyID },
      { balance: company.balance - bid }
    );
    const campaign = await CampaignsSchema.findById({ _id: campaignID });
    const resp = await CampaignsSchema.findByIdAndUpdate(
      { _id: campaignID },
      {
        total_spent: campaign.total_spent + bid,
        today_spent: campaign.today_spent + bid,
      }
    );
    res.status(200).send(resp);
  } catch (err) {
    console.error(err);
  }
});

router.put("/add_promoter_balance/:promoter_id", auth, async (req, res) => {
  const { promoter_id } = req.params;
  const { moneyToAdd } = req.body;
  if (promoter_id !== req.user.promoter_id) {
    return res.status(400).json({
      success: false,
      data: "Not Authorized",
    });
  }
  try {
    const promoter = await PromotersSchema.findOne({ _id: promoter_id });
    const oldBalance = promoter.withdrawal_balance;
    const newBalance = oldBalance + moneyToAdd;

    const response = await PromotersSchema.findByIdAndUpdate(
      promoter_id,
      { withdrawal_balance: promoter.withdrawal_balance + moneyToAdd },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).send(response);
  } catch (err) {
    console.error(err);
  }
});

// @desc        signup promoter
// @route       POST /promoter/signup
// @access      Public
router.post("/signup", async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    password,
    confirm_password,
    phone_number,
  } = req.body;
  if (password !== confirm_password) {
    return res.status(400).json({
      success: false,
      data: "Passwords do not match",
    });
  }
  try {
    const hash_password = await bcrypt.hash(password, 10);
    const promoter = await PromotersSchema.create({
      first_name,
      last_name,
      email,
      hash_password,
      phone_number,
      type: "Promoter",
    });

    const payload = {
      user: {
        first_name,
        last_name,
        email,
        type: "Promoter",
        promoter_id: promoter.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "5 days" },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({
          token,
          payload,
          success: true,
        });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      data: "Server error",
    });
  }
});

// @desc        Login promoter
// @route       POST /promoter/login
// @access      Public
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        data: "Please provide password & email",
      });
    }
    const promoter = await PromotersSchema.findOne({ email });

    if (!promoter) {
      return res.status(400).json({
        success: false,
        data: "Promoter was not found",
      });
    }

    const isMatch = await bcrypt.compare(password, promoter.hash_password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        data: "The password you provided is incorrect",
      });
    }
    const payload = {
      user: {
        first_name: promoter.first_name,
        last_name: promoter.last_name,
        email: promoter.email,
        type: promoter.type,
        promoter_id: promoter.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "5 days" },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({
          token,
          payload,
          success: true,
        });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      data: "Server error",
    });
  }
});

// @desc        Get all promoters
// @route       GET /promoters
// @access      Private/Admin
// need middleware to authenticate admin
router.get("/", auth, async (req, res) => {
  const { type } = req.user;
  if (type !== "Admin") {
    return res.status(400).json({
      success: false,
      data: "Not Authorized",
    });
  }
  try {
    const promoters = await PromotersSchema.find().populate({
      path: "promoters",
      select: "first_name last_name email",
    });

    res.status(200).json({
      success: true,
      data: promoters,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      data: "Server error",
    });
  }
});

// @desc        Get single promoter
// @route       GET /promoters/:id
// @access      Private
router.get("/:id", auth, async (req, res) => {
  const { type, promoter_id } = req.user;
  const { id } = req.params;
  if (type !== "Admin" && promoter_id !== id) {
    return res.status(400).json({
      success: false,
      data: "Not Authorized",
    });
  }
  try {
    const promoter = await PromotersSchema.findById(req.params.id);

    res.status(200).json({
      success: true,
      data: promoter,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      data: "Server error",
    });
  }
});

// @desc        Update promoter
// @route       PUT /promoters/:id
// @access      Private
router.put("/:id", auth, async (req, res) => {
  const { type, promoter_id } = req.user;
  const { id } = req.params;
  if (type !== "Admin" && promoter_id !== id) {
    return res.status(400).json({
      success: false,
      data: "Not Authorized",
    });
  }
  try {
    const promoter = await PromotersSchema.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      data: promoter,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      data: "Server error",
    });
  }
});

// @desc        Delete promoter
// @route       delete /promoters/:id
// @access      Private
router.delete("/:id", async (req, res) => {
  const { type, promoter_id } = req.user;
  const { id } = req.params;
  if (type !== "Admin" && promoter_id !== id) {
    return res.status(400).json({
      success: false,
      data: "Not Authorized",
    });
  }
  try {
    const promoter = await PromotersSchema.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: promoter,
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
