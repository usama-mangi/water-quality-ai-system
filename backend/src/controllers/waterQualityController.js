const WaterQuality = require('../models/waterQualityModel');
const Alert = require('../models/alertModel');
const notification = require('../utils/notification');
const axios = require('axios');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://ml-service:5000';

const createReading = async (req, res) => {
  try {
    const { 
      station_id, ph, dissolved_oxygen, temperature, turbidity, conductivity,
      ammonia, nitrates, chlorophyll_a
    } = req.body;

    // Detect Anomaly via ML Service
    let anomaly_score = null;
    let is_anomaly = false;

    try {
      const mlResponse = await axios.post(`${ML_SERVICE_URL}/predict`, {
        ph, dissolved_oxygen, temperature, turbidity, conductivity
      });
      anomaly_score = mlResponse.data.anomaly_score;
      is_anomaly = mlResponse.data.is_anomaly;
    } catch (mlError) {
      console.error('ML Service Error:', mlError.message);
    }

    const reading = await WaterQuality.addReading({
      station_id, ph, dissolved_oxygen, temperature, turbidity, conductivity,
      ammonia, nitrates, chlorophyll_a,
      anomaly_score, is_anomaly
    });

    // Handle Anomaly Alert
    if (is_anomaly) {
      const alert = await Alert.createAlert({
        station_id,
        alert_type: 'ANOMALY_DETECTED',
        severity: 'HIGH',
        description: `Anomaly detected in water quality parameters at station ${station_id}`,
        parameter: 'MULTI_PARAMETER',
        actual_value: anomaly_score,
        recipients: ['admin@example.com'] // Mock recipient
      });

      await notification.notify(alert);

      const io = req.app.get('io');
      if (io) {
        io.emit('anomaly_detected', {
          station_id,
          reading_id: reading.id,
          alert_id: alert.id,
          timestamp: reading.timestamp
        });
      }
    }

    res.status(201).json({
      status: 201,
      message: 'Reading recorded successfully',
      data: reading
    });
  } catch (error) {
    console.error('Create reading error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getReadings = async (req, res) => {
  try {
    const { station_id, limit, offset, start_date, end_date } = req.query;
    
    const readings = await WaterQuality.getReadings({
      station_id,
      limit: parseInt(limit) || 100,
      offset: parseInt(offset) || 0,
      start_date,
      end_date
    });

    res.json({
      status: 200,
      count: readings.length,
      data: readings
    });
  } catch (error) {
    console.error('Get readings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getReadingById = async (req, res) => {
  try {
    const reading = await WaterQuality.getReadingById(req.params.id);
    if (!reading) {
      return res.status(404).json({ message: 'Reading not found' });
    }
    res.json({
      status: 200,
      data: reading
    });
  } catch (error) {
    console.error('Get reading error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createReading,
  getReadings,
  getReadingById
};
