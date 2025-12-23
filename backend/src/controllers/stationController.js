const Station = require('../models/stationModel');

const createStation = async (req, res) => {
  try {
    const { id, name, description, latitude, longitude, address, water_body } = req.body;
    
    // In a real app, we'd validate the input strictly here
    
    const station = await Station.createStation({
      id, // Assuming the client provides an ID like 'STN001' or we generate it. 
          // The schema has VARCHAR(50) for ID, not UUID auto-gen for stations table in init.sql
      name,
      description,
      latitude,
      longitude,
      address,
      water_body,
      owner_id: req.user.id // From auth middleware
    });

    res.status(201).json({
      message: 'Station created successfully',
      data: station
    });
  } catch (error) {
    console.error('Create station error:', error);
    if (error.code === '23505') { // Unique violation
      return res.status(409).json({ message: 'Station ID already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllStations = async (req, res) => {
  try {
    const stations = await Station.getAllStations();
    res.json({
      status: 200,
      results: stations.length,
      data: stations
    });
  } catch (error) {
    console.error('Get stations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getStationById = async (req, res) => {
  try {
    const station = await Station.getStationById(req.params.id);
    if (!station) {
      return res.status(404).json({ message: 'Station not found' });
    }
    res.json({
      status: 200,
      data: station
    });
  } catch (error) {
    console.error('Get station error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateStation = async (req, res) => {
  try {
    const station = await Station.updateStation(req.params.id, req.body);
    if (!station) {
      return res.status(404).json({ message: 'Station not found' });
    }
    res.json({
      status: 200,
      message: 'Station updated',
      data: station
    });
  } catch (error) {
    console.error('Update station error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteStation = async (req, res) => {
  try {
    const result = await Station.deleteStation(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Station not found' });
    }
    res.json({
      status: 200,
      message: 'Station deleted'
    });
  } catch (error) {
    console.error('Delete station error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createStation,
  getAllStations,
  getStationById,
  updateStation,
  deleteStation
};
