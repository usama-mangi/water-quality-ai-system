const db = require('../config/db');

const createStation = async (stationData) => {
  const {
    id, name, description, latitude, longitude, address, water_body, owner_id
  } = stationData;

  const query = `
    INSERT INTO stations (id, name, description, latitude, longitude, address, water_body, owner_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;
  `;

  const values = [id, name, description, latitude, longitude, address, water_body, owner_id];
  const { rows } = await db.query(query, values);
  return rows[0];
};

const getAllStations = async () => {
  const query = 'SELECT * FROM stations ORDER BY created_at DESC';
  const { rows } = await db.query(query);
  return rows;
};

const getStationById = async (id) => {
  const query = 'SELECT * FROM stations WHERE id = $1';
  const { rows } = await db.query(query, [id]);
  return rows[0];
};

const updateStation = async (id, stationData) => {
  const { name, description, status, alert_enabled } = stationData;
  
  const query = `
    UPDATE stations 
    SET name = COALESCE($2, name),
        description = COALESCE($3, description),
        status = COALESCE($4, status),
        alert_enabled = COALESCE($5, alert_enabled),
        updated_at = NOW()
    WHERE id = $1
    RETURNING *;
  `;
  
  const values = [id, name, description, status, alert_enabled];
  const { rows } = await db.query(query, values);
  return rows[0];
};

const deleteStation = async (id) => {
  const query = 'DELETE FROM stations WHERE id = $1 RETURNING id';
  const { rows } = await db.query(query, [id]);
  return rows[0];
};

module.exports = {
  createStation,
  getAllStations,
  getStationById,
  updateStation,
  deleteStation
};
