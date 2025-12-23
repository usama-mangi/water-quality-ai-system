const WaterQuality = require('../models/waterQualityModel');

const createReading = async (req, res) => {
  try {
    const { 
      station_id, ph, dissolved_oxygen, temperature, turbidity, conductivity,
      ammonia, nitrates, chlorophyll_a
    } = req.body;

    // Validate station_id exists? Foreign key constraint will handle it, 
    // but nicer to check. For MVP, let DB handle constraint errors.

    const reading = await WaterQuality.addReading({
      station_id, ph, dissolved_oxygen, temperature, turbidity, conductivity,
      ammonia, nitrates, chlorophyll_a
    });

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
