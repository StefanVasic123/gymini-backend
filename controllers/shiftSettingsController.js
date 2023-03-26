const asyncHandler = require('express-async-handler');

const ShiftSettings = require('../models/shiftSettingsModel');

// @desc set shiftSettings
// @route POST/UPDATE /api/shift-settings
// @access private (?)
const setShiftSettings = asyncHandler(async (req, res) => {
  const { userId, firstShift, secondShift, thirdShift } = req.body;

  if (
    !req.body.userId ||
    (!req.body.firstShift && req.body.firstShift !== null) ||
    (!req.body.secondShift && req.body.secondShift !== null) ||
    (!req.body.thirdShift && req.body.thirdShift !== null)
  ) {
    res.status(400);
    throw new Error('Some data is missing');
  }

  const filter = { userId };

  const query = {
    firstShift,
    secondShift,
    thirdShift,
  };

  const options = { new: true, upsert: true };

  const shiftSettings = await ShiftSettings.findOneAndUpdate(
    filter,
    query,
    options
  );

  res.status(200).json(shiftSettings);
});

// @desc GET shift data
// @method GET
// @access private (?)
const getShiftSettings = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  if (!req.user._id) {
    res.status(400);
    throw new Error('Client ID is missing');
  }

  const filter = { userId };

  const shiftSettings = await ShiftSettings.find(filter);

  res.status(200).json(shiftSettings);
});

module.exports = {
  setShiftSettings,
  getShiftSettings,
};
