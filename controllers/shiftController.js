const asyncHandler = require('express-async-handler');

const Shift = require('../models/shiftModel');

// @desc set endShift
// @route POST /api/end-shift
// @access private (?)
const endShift = asyncHandler(async (req, res) => {
  const {
    userId,
    endShift,
    shiftNumber,
    shiftDuration,
    staffName,
    turnover,
    totalTurnover,
  } = req.body;

  if (
    !req.body.userId ||
    !req.body.endShift ||
    (!req.body.shiftNumber && req.body.shiftNumber !== 0) ||
    !req.body.shiftDuration ||
    (!req.body.staffName && req.body.staffName !== '') ||
    (!req.body.turnover && req.body.turnover !== 0) ||
    (!req.body.totalTurnover && req.body.totalTurnover !== 0)
  ) {
    res.status(400);
    throw new Error('Some data is missing');
  }

  const shift = await Shift.create({
    userId,
    endShift,
    shiftNumber,
    shiftDuration,
    staffName,
    turnover,
    totalTurnover,
  });

  res.status(200).json(shift);
});

// @desc get last shift
// @route GET /api/last-shift
// @access private ?
const getLastShift = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  if (!userId) {
    res.status(400);
    throw new Error('There is no user id.');
  }

  const today = new Date();
  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const endOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 1
  );

  const filter = { userId, createdAt: { $gte: startOfDay, $lte: endOfDay } };
  const sort = { shiftNumber: -1 };
  const limit = 1;

  const lastShift = await Shift.find(filter).sort(sort).limit(limit);
  res.json(lastShift);
});

const deleteShift = asyncHandler(async (req, res) => {
  console.log('params: ', req.params.id);

  const shiftId = req.params.id;

  if (!req.params.id) {
    res.status(400);
    throw new Error("Shift doesn't exist");
  }

  let shift = await Shift.findById(shiftId);

  await shift.remove();

  res.status(200).json({ shiftId: shiftId });
});

const getShiftsByDate = asyncHandler(async (req, res) => {
  let { userId, startDate } = req.body;

  if ((!userId, !startDate)) {
    res.status(400);
    throw new Error('Invalid entered data');
  }

  const start = new Date(startDate);

  // Calculate the end of the day by adding 1 day and subtracting 1 millisecond
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000 - 1);

  const filter = {
    userId,
    createdAt: { $gte: start, $lte: end },
  };

  const shiftsByDate = await Shift.find(filter);

  res.json(shiftsByDate);
});

module.exports = {
  endShift,
  getLastShift,
  deleteShift,
  getShiftsByDate,
};
