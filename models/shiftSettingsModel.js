const mongoose = require('mongoose');

const shiftSettingsSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  firstShift: {
    type: Object,
    default: {},
  },
  secondShift: {
    type: Object,
    default: {},
  },
  thirdShift: {
    type: Object,
    default: {},
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ShiftSettings', shiftSettingsSchema);
