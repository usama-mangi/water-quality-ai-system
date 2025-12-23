const db = require('../config/db');

const createAlert = async (alertData) => {
  const {
    station_id, alert_type, severity, description, parameter, threshold_value, actual_value, recipients
  } = alertData;

  const query = `
    INSERT INTO alerts (station_id, alert_type, severity, description, parameter, threshold_value, actual_value, recipients, triggered_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
    RETURNING *;
  `;

  const values = [station_id, alert_type, severity, description, parameter, threshold_value, actual_value, recipients];
  const { rows } = await db.query(query, values);
  return rows[0];
};

const getAlertsByStation = async (station_id) => {
  const query = 'SELECT * FROM alerts WHERE station_id = $1 ORDER BY triggered_at DESC';
  const { rows } = await db.query(query, [station_id]);
  return rows;
};

const updateAlertStatus = async (id, status, notes) => {
  const query = `
    UPDATE alerts 
    SET status = $2, 
        notes = COALESCE($3, notes),
        acknowledged_at = CASE WHEN $2 = 'ACKNOWLEDGED' AND acknowledged_at IS NULL THEN NOW() ELSE acknowledged_at END,
        resolved_at = CASE WHEN $2 = 'RESOLVED' AND resolved_at IS NULL THEN NOW() ELSE resolved_at END
    WHERE id = $1
    RETURNING *;
  `;
  const { rows } = await db.query(query, [id, status, notes]);
  return rows[0];
};

module.exports = {
  createAlert,
  getAlertsByStation,
  updateAlertStatus
};
