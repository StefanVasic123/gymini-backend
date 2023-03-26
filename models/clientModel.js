const mongoose = require('mongoose');

const clientSchema = mongoose.Schema({
  // user associated with the client
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  name: {
    type: String,
    required: [true, 'Please add client name'],
  },
  lastName: {
    type: String,
    required: [true, 'Please add client last name'],
  },
  email: {
    type: String,
  },
  phone: {
    type: Number,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  password: {
    type: String,
  },
  package: {
    type: String,
  },
  packagePrice: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Client', clientSchema);
