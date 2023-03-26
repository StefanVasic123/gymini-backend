const mongoose = require('mongoose');

const packagePriceSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  dailyPrice: {
    type: Number,
    default: null,
  },
  monthlyPrice: {
    type: Number,
    default: null,
  },
  yearlyPrice: {
    type: Number,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('PackagePrice', packagePriceSchema);
