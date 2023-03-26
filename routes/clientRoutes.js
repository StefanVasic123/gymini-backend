const express = require('express');
const router = express.Router();
const {
  getClients,
  setClient,
  loginClient,
  updateClient,
  deleteClient,
  getTodayCreatedClients,
  getClientsByDate,
  getClientsByMonth,
  getClientsByYear,
} = require('../controllers/clientController');
const {
  endShift,
  getLastShift,
  deleteShift,
  getShiftsByDate,
} = require('../controllers/shiftController');
const {
  setShiftSettings,
  getShiftSettings,
} = require('../controllers/shiftSettingsController');
const {
  setPackagePrices,
  getPackagePrices,
} = require('../controllers/packagePriceController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getClients).post(protect, setClient);
router.route('/:id').delete(protect, deleteClient).put(protect, updateClient);
router.route('/admin').get(protect, getClients); // TODO: refactor
router.route('/client-login').post(loginClient);
router.route('/end-shift').post(endShift);
router.route('/get-last-shift').get(protect, getLastShift);
router.route('/get-clients-by-date').post(protect, getClientsByDate);
router.route('/get-clients-by-month').post(protect, getClientsByMonth);
router.route('/get-clients-by-year').post(protect, getClientsByYear);
router.route('/set-shift-settings').post(setShiftSettings);
router.route('/get-shift-settings').get(protect, getShiftSettings);
router.route('/set-package-prices').post(setPackagePrices);
router.route('/get-package-prices').get(protect, getPackagePrices);
router.route('/today-created-clients').get(protect, getTodayCreatedClients);
router.route('/delete-shift/:id').delete(protect, deleteShift);
router.route('/get-shifts-by-date').post(protect, getShiftsByDate);

module.exports = router;
