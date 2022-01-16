const mongoose = require("mongoose");

const CampaignsSchema = new mongoose.Schema({
  campaign_name: {
    type: String,
    required: true,
  },
  campaign_status: {
    type: String,
    required: true,
  },
  company_id: {
    type: mongoose.Schema.ObjectId,
    ref: "companies",
    required: true,
  },
  asset: {
    type: String,
  },
  current_bid: {
    type: Number,
  },
  daily_budget: {
    type: Number,
  },
  total_budget: {
    type: Number,
  },
  area: {
    type: Number,
  },
  today_spent: {
    type: Number,
    default: 0,
  },
  total_spent: {
    type: Number,
    default: 0,
  },
  date_created: {
    type: Date,
    default: Date.now,
  },
  date_modified: {
    type: Date,
  },
});

module.exports = mongoose.model("campaigns", CampaignsSchema);
