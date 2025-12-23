const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');
const verifyToken = require('../middleware/authMiddleware');

router.use(verifyToken);

router.get('/', alertController.getAlerts);
router.put('/:id/status', alertController.updateStatus);

module.exports = router;
