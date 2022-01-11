const mongoose = require('mongoose');

const PromotersSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  hash_password: {
    type: String,
    required: true
  },
  pending_balance: {
    type: Number,
    required: true,
    default: 0
  },
  withdrawal_balance: {
    type: Number,
    required: true,
    default: 0
  },
  id_tz: {
    type: Number
  },
  country: {
    type: String
  },
  city: {
    type: String
  },
  address: {
    type: String
  },
  zip_code: {
    type: Number
  },
  phone_number: {
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

module.exports = mongoose.model('promoters', PromotersSchema);
