const mailService = require('../services/MailService');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Client = require('../models/clientModel');

// @desc Get clients
// @route GET /api/clients
// @access private
const getClients = asyncHandler(async (req, res) => {
  const clients = await Client.find({ user: req.user.id });

  res.status(200).json(clients);
});

// @desc Set client
// @route SET /api/clients
// @access private
const setClient = asyncHandler(async (req, res) => {
  if (
    !req.body.name ||
    !req.body.lastName ||
    !req.body.startDate ||
    !req.body.endDate ||
    !req.body.dbProgram
  ) {
    res.status(400);
    throw new Error('Some field is missing');
  }

  // Generate random password
  const randomPassword = Math.random().toString(36).slice(-8);

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(randomPassword, salt);

  const client = await Client.create({
    name: req.body.name,
    lastName: req.body.lastName,
    email: req.body.email,
    phone: req.body.phone,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    user: req.user.id,
    password: hashedPassword,
    package: req.body.dbProgram,
    packagePrice: req.body.packagePrice,
  });

  console.log('mailService: ', mailService);

  mailService(req.body.email, randomPassword);

  res.status(200).json(client);
});

// @desc Set client
// @route SET /api/clients
// @access private
const loginClient = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  const client = await Client.findOne({ email });

  if (client && (await bcrypt.compare(password, client.password))) {
    res.json({
      _id: client.id,
      name: client.name,
      lastName: client.lastName,
      email: client.email,
      password: client.password,
      endDate: client.endDate,
    });
  } else {
    res.status(400);
    throw new Error('Invalid credentials');
  }
});

// @desc Update client
// @route PUT /api/client
// @access private
const updateClient = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id);

  if (!client) {
    res.status(400);
    throw new Error('Client not found');
  }

  // Check for user
  if (!req.user) {
    res.status(401);
    throw new Error('User is not find');
  }

  // Make sure the logged in user matches the client user
  if (client.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  const updatedClient = await Client.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );

  res.status(200).json(updatedClient);
});

// @desc Delete client
// @route DELETE /api/client
// @access private
const deleteClient = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id);

  if (!client) {
    res.status(400);
    throw new Error('Client not found');
  }

  // Check for user
  if (!req.user) {
    res.status(401);
    throw new Error('Client is not find');
  }

  // Make sure the logged in user matches the client user
  if (client.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Client not authorized');
  }

  await client.remove();

  res.status(200).json({ id: req.params.id });
});

// @desc Get users entered today
// @route GET api/users/today-created-users
const getTodayCreatedClients = asyncHandler(async (req, res) => {
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

  const todayCreatedClients = await Client.find(filter);
  res.json(todayCreatedClients);
});

// @desc Get clients by date
// @route POST api/get-clients-by-date
// @access private
const getClientsByDate = asyncHandler(async (req, res) => {
  const { userId, startDate } = req.body;

  if (!userId || !startDate) {
    res.status(400);
    throw new Error('User ID or start date not provided');
  }

  // Parse the startDate parameter into a JavaScript date object
  const start = new Date(startDate);

  // Calculate the end of the day by adding 1 day and subtracting 1 millisecond
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000 - 1);

  const filter = {
    userId,
    createdAt: { $gte: start, $lte: end },
  };

  const clientsByDate = await Client.find(filter).select('packagePrice');
  res.json(clientsByDate);
});

// @desc Get clients by month
// @route POST api/get-clients-by-month
// @access private
const getClientsByMonth = asyncHandler(async (req, res) => {
  const { userId, month, year } = req.body;

  if (!userId || !month || !year) {
    res.status(400);
    throw new Error("There is no user id od date isn't choosen correctly");
  }
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  const filter = {
    userId,
    createdAt: { $gte: startDate, $lte: endDate },
  };

  const clientsByMonth = await Client.find(filter).select('packagePrice');

  res.json(clientsByMonth);
});

// @desc Get clients by year
// @route POST api/get-clients-by-year
// @access private
const getClientsByYear = asyncHandler(async (req, res) => {
  const { userId, year } = req.body;

  if (!userId || !year) {
    res.status(400);
    throw new Error("There is no user id or year isn't chosen correctly");
  }

  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);

  const filter = {
    userId,
    createdAt: { $gte: startDate, $lte: endDate },
  };

  const clientsByYear = await Client.find(filter).select('packagePrice');

  res.json(clientsByYear);
});

module.exports = {
  getClients,
  setClient,
  loginClient,
  updateClient,
  deleteClient,
  getTodayCreatedClients,
  getClientsByDate,
  getClientsByMonth,
  getClientsByYear,
};
