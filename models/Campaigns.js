const mongoose = require('mongoose');

const CampaignsSchema = new mongoose.Schema({
  campaign_name: {
    type: String,
    required: true
  },
  advertiser_id: {
    type: String,
    required: true
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
    type: Number
  },
  date_created: {
    type: Date,
    default: Date.now
  },
  date_modified: {
    type: Date,
  }
});

module.exports = mongoose.model('campaigns', CampaignsSchema);
