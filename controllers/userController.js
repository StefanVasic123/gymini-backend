const { sendResetPasswordLink } = require('../services/MailService');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

const generateRandomSecret = async () => {
  // Generate a random string
  const randomSecret = Math.random().toString(36).substring(2, 34); // Generates a random alphanumeric string of length 32

  // Hash the random secret using bcrypt
  const salt = await bcrypt.genSalt(10);
  const hashedSecret = await bcrypt.hash(randomSecret, salt);

  return hashedSecret;
};

const generateRandomResetPasswordToken = async () => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = 16; // Length of the token

  let randomToken = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomToken += characters.charAt(randomIndex);
  }

  return randomToken;
};

// @desc Register new user
// @route POST api/users
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, adminPassword } = req.body;
  if (!name || !email || !password || !adminPassword) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  // Check if user exist
  const userExist = await User.findOne({ email });

  if (userExist) {
    res.status(400);
    throw new Error('User already exist');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const hashedAdminPassword = await bcrypt.hash(adminPassword, salt);
  const adminSecret = await generateRandomSecret();

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    adminPassword: hashedAdminPassword,
    adminSecret,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc Authenticate new user
// @route POST api/users/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid credentials');
  }
});

// @desc Get user data
// @route GET api/users/me
// @access Private
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

const loginAdmin = asyncHandler(async (req, res) => {
  const { adminPassword, email } = req.body;

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(adminPassword, user.adminPassword))) {
    res.json({
      adminToken: generateToken(user.adminId),
      adminSecret: user.adminSecret,
    });
  } else {
    res.status(400);
    throw new Error('Invalid credentials for admin user login');
  }
});

const changeUserPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword, email } = req.body;

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(oldPassword, user.password))) {
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } else {
    res.status(400);
    throw new Error('Old passwords are not correct!');
  }
});

const changeAdminPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword, email } = req.body;

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(oldPassword, user.adminPassword))) {
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    user.adminPassword = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: 'Admin password updated successfully' });
  } else {
    res.status(400);
    throw new Error('Old admin passwords are not correct!');
  }
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  const resetPasswordToken = await generateRandomResetPasswordToken();

  const link =
    process.env.NODE_ENV === 'development'
      ? `http://localhost:3000/token=${resetPasswordToken}/reset-password`
      : `https://dev-gymini.onrender.com/token=${resetPasswordToken}/reset-password`;

  // if user => send reset password email
  if (user) {
    // generate resetPasswordToken
    user.resetPasswordToken = resetPasswordToken;
    await user.save();
    sendResetPasswordLink(email, link);
    res
      .status(200)
      .json({ message: `Reset password link sent to email: ${email}` });
  } else {
    res.status(400);
    throw new Error('Bad email: no user');
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params; // Extract token from URL parameter
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      //  resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      res.status(400).json({ message: 'Invalid or expired token' });
      return;
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user's password and remove reset token
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    // user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

const forgotAdminPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  const resetAdminPasswordToken = await generateRandomResetPasswordToken();

  const link =
    process.env.NODE_ENV === 'development'
      ? `http://localhost:3000/token=${resetAdminPasswordToken}/reset-admin-password`
      : `https://dev-gymini.onrender.com/token=${resetAdminPasswordToken}/reset-admin-password`;

  // if user => send reset password email
  if (user) {
    // generate resetPasswordToken
    user.resetAdminPasswordToken = resetAdminPasswordToken;
    await user.save();
    sendResetPasswordLink(email, link);
    res
      .status(200)
      .json({ message: `Reset admin password link sent to email: ${email}` });
  } else {
    res.status(400);
    throw new Error('Bad email: no user');
  }
});

const resetAdminPassword = asyncHandler(async (req, res) => {
  const { token } = req.params; // Extract token from URL parameter
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetAdminPasswordToken: token,
      //  resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      res.status(400).json({ message: 'Invalid or expired token' });
      return;
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedAdminPassword = await bcrypt.hash(password, salt);

    // Update user's password and remove reset token
    user.adminPassword = hashedAdminPassword;
    user.resetAdminPasswordToken = undefined;
    // user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Admin password reset successful' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = {
  registerUser,
  loginUser,
  loginAdmin,
  getMe,
  changeUserPassword,
  changeAdminPassword,
  forgotPassword,
  resetPassword,
  forgotAdminPassword,
  resetAdminPassword,
};
