const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  loginAdmin,
} = require('../controllers/userController');
const { protect, protectAdmin } = require('../middleware/authMiddleware');

router.post('/', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.post('/loginAdmin', loginAdmin);
router.get('/admin', protectAdmin, (req, res) => {
  res.json({ message: 'Welcome to admin page' });
});

module.exports = router;
