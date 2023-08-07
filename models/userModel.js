const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
    },
    adminPassword: {
      type: String,
      required: [true, 'Please add an admin password'],
    },
    adminId: {
      type: String,
      unique: true,
    },
    adminSecret: {
      type: String,
      unique: true,
    },
    resetPasswordToken: {
      type: String,
      unique: true,
    },
    resetAdminPasswordToken: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to generate random adminId
userSchema.pre('save', function (next) {
  // Generate a random 8-character hexadecimal string for adminId
  this.adminId = crypto.randomBytes(4).toString('hex');
  next();
});

module.exports = mongoose.model('User', userSchema);
