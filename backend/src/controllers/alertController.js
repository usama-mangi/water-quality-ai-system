const Alert = require('../models/alertModel');

const getAlerts = async (req, res) => {
  try {
    const { station_id } = req.query;
    if (!station_id) {
      return res.status(400).json({ message: 'station_id is required' });
    }
    const alerts = await Alert.getAlertsByStation(station_id);
    res.json({ status: 200, data: alerts });
  } catch (error) {
    console.error('Get alerts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const alert = await Alert.updateAlertStatus(req.params.id, status, notes);
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    res.json({ status: 200, message: 'Alert status updated', data: alert });
  } catch (error) {
    console.error('Update alert status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAlerts,
  updateStatus
};
