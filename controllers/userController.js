const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

// Function to generate a random secret
const generateRandomSecret = async () => {
  // Generate a random string
  const randomSecret = Math.random().toString(36).substring(2, 34); // Generates a random alphanumeric string of length 32

  // Hash the random secret using bcrypt
  const salt = await bcrypt.genSalt(10);
  const hashedSecret = await bcrypt.hash(randomSecret, salt);

  return hashedSecret;
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
};
