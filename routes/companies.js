const express = require("express");
const router = express.Router();
const CompaniesSchema = require("../models/Companies");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { auth } = require("../middleware/auth");

// @desc        signup company
// @route       POST /company/signup
// @access      Public
router.post("/signup", async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    password,
    confirm_password,
    phone_number,
    company_name,
    company_number,
    company_vat_id,
  } = req.body;
  if (password !== confirm_password) {
    return res.status(400).json({
      success: false,
      data: "Passwords do not match",
    });
  }
  try {
    const hash_password = await bcrypt.hash(password, 10);
    const company = await CompaniesSchema.create({
      first_name,
      last_name,
      email,
      hash_password,
      phone_number,
      type: "Company",
      company_name,
      company_number,
      company_vat_id,
    });
    console.log(company);
    console.log(company.id);

    const payload = {
      user: {
        first_name,
        last_name,
        email,
        type: "Company",
        company_name,
        company_id: company.id,
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

// @desc        Login company
// @route       POST /company/login
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
    const company = await CompaniesSchema.findOne({ email });
    console.log(company);

    if (!company) {
      return res.status(400).json({
        success: false,
        data: "Promoter was not found",
      });
    }

    const isMatch = await bcrypt.compare(password, company.hash_password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        data: "The password you provided is incorrect",
      });
    }
    const payload = {
      user: {
        first_name: company.first_name,
        last_name: company.last_name,
        email: company.email,
        type: company.type,
        company_name: company.company_name,
        company_id: company.id,
      },
    };

    console.log(payload);
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

// @desc        Get all companies
// @route       GET /companies
// @access      Private
// need middleware to authenticate admin
router.get("/", auth, async (req, res) => {
  if (req.user.type !== "Admin") {
    return res.status(400).json({
      success: false,
      data: "Not Authorized",
    });
  }
  try {
    const companies = await CompaniesSchema.find();

    res.status(200).json({
      success: true,
      data: companies,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      data: "Server error",
    });
  }
});

// @desc        Get single company
// @route       GET /companies/:id
// @access      Private
router.get("/:id", auth, async (req, res) => {
  const { type, company_id } = req.user;
  const { id } = req.params;
  if (type !== "Admin" && company_id !== id) {
    return res.status(400).json({
      success: false,
      data: "Not Authorized",
    });
  }
  try {
    const company = await CompaniesSchema.find({ _id: id });
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

// @desc        Update company
// @route       PUT /companies/:id
// @access      Private
router.put("/:id", auth, async (req, res) => {
  const { type, company_id } = req.user;
  const { id } = req.params;
  if (type !== "Admin" && company_id !== id) {
    return res.status(400).json({
      success: false,
      data: "Not Authorized",
    });
  }
  try {
    const company = await CompaniesSchema.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

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

// @desc        Delete company
// @route       delete /companies/:id
// @access      Private
router.delete("/:id", auth, async (req, res) => {
  const { type, company_id } = req.user;
  const { id } = req.params;
  if (type !== "Admin" && company_id !== id) {
    return res.status(400).json({
      success: false,
      data: "Not Authorized",
    });
  }
  try {
    const company = await PromotersSchema.findByIdAndDelete(id);
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
