const mongoose = require('mongoose');

const currentDate = new Date();
const utcDate = Date.UTC(
  currentDate.getUTCFullYear(),
  currentDate.getUTCMonth(),
  currentDate.getUTCDate(),
  currentDate.getUTCHours(),
  currentDate.getUTCMinutes(),
  currentDate.getUTCSeconds(),
  currentDate.getUTCMilliseconds()
);

const shiftSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  endShift: {
    type: String,
    required: true,
  },
  shiftNumber: {
    type: Number,
  },
  shiftDuration: {
    type: Array,
  },
  staffName: {
    type: String,
  },
  turnover: {
    type: Number,
    required: true,
  },
  totalTurnover: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: () => new Date(Date.now()).toISOString(),
  },
});

module.exports = mongoose.model('Shift', shiftSchema);
