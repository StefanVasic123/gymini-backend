const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  loginAdmin,
  changeUserPassword,
  changeAdminPassword,
  forgotPassword,
  resetPassword,
  forgotAdminPassword,
  resetAdminPassword,
} = require('../controllers/userController');
const { protect, protectAdmin } = require('../middleware/authMiddleware');

router.post('/', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.post('/loginAdmin', loginAdmin);
router.get('/admin', protectAdmin, (req, res) => {
  res.json({ message: 'Welcome to admin page' });
});
router.post('/change-user-password', changeUserPassword);
router.post('/change-admin-password', changeAdminPassword);
router.post('/forgot-password', forgotPassword);
router.post('/:token/reset-password', resetPassword);
router.post('/forgot-admin-password', forgotAdminPassword);
router.post('/:token/reset-admin-password', resetAdminPassword);

module.exports = router;
