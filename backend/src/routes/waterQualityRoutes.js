const express = require('express');
const router = express.Router();
const waterQualityController = require('../controllers/waterQualityController');
const verifyToken = require('../middleware/authMiddleware');

// Readings can be public or private? 
// Specification says "List readings with filters" under core endpoints.
// Usually reading data is allowed for authenticated users.

router.use(verifyToken);

router.get('/readings', waterQualityController.getReadings);
router.get('/readings/:id', waterQualityController.getReadingById);
router.post('/readings', waterQualityController.createReading);

module.exports = router;
