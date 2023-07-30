const asyncHandler = require('express-async-handler');

const PackagePrice = require('../models/packageModel');

// @desc set shiftSettings
// @route POST/UPDATE /api/shift-settings
// @access private (?)
const setPackagePrices = asyncHandler(async (req, res) => {
  const { userId, dailyPrice, monthlyPrice, yearlyPrice } = req.body;

  if (
    !req.body.userId ||
    (!req.body.dailyPrice && req.body.dailyPrice !== null) ||
    (!req.body.monthlyPrice && req.body.monthlyPrice !== null) ||
    (!req.body.yearlyPrice && req.body.yearlyPrice !== null)
  ) {
    res.status(400);
    throw new Error('Some data is missing');
  }

  const filter = { userId };

  const query = {
    dailyPrice,
    monthlyPrice,
    yearlyPrice,
  };

  const options = { new: true, upsert: true };

  const packagePrice = await PackagePrice.findOneAndUpdate(
    filter,
    query,
    options
  );

  res.status(200).json(packagePrice);
});

// @desc GET package prices
// @method GET
// @access private (?)
const getPackagePrices = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  if (!userId) {
    res.status(400);
    throw new Error('Client ID is missing');
  }

  const filter = { userId };

  const packagePrices = await PackagePrice.find(filter);

  res.status(200).json(packagePrices);
});

module.exports = { setPackagePrices, getPackagePrices };
