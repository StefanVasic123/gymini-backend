const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error('Not authorized');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

const protectAdmin = asyncHandler(async (req, res, next) => {
  let headersToken;
  try {
    // Check if the user is authenticated using the loginAdmin function
    const { admintoken, token, adminsecret } = req.headers; // Assuming the token is sent in the headers
    //  token = req.headers.authorization.split(' ')[1];
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // Get token from header
      headersToken = req.headers.authorization.split(' ')[1];
    }

    // admintoken = hashed admin
    if (!admintoken) {
      res.status(401);
      throw new Error('Not authorized, no token');
    }

    // Verify token and get the user
    const decoded = jwt.verify(token || headersToken, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized');
    }

    if (adminsecret !== req.user.adminSecret) {
      res.status(403);
      throw new Error('Not authorized as an admin');
    }

    next();
  } catch (error) {
    res.status(401);
    throw new Error('Error: Not authorized');
  }
});

module.exports = { protect, protectAdmin };
