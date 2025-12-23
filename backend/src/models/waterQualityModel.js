const db = require('../config/db');

const addReading = async (readingData) => {
  const {
    station_id, ph, dissolved_oxygen, temperature, turbidity, conductivity,
    ammonia, nitrates, chlorophyll_a
  } = readingData;

  // quality_index and anomaly_score would typically be calculated by a separate service or function
  // For now, we'll insert them as null or defaults if provided
  
  const query = `
    INSERT INTO water_quality_readings 
    (station_id, timestamp, ph, dissolved_oxygen, temperature, turbidity, conductivity, ammonia, nitrates, chlorophyll_a)
    VALUES ($1, NOW(), $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *;
  `;

  const values = [
    station_id, ph, dissolved_oxygen, temperature, turbidity, conductivity,
    ammonia, nitrates, chlorophyll_a
  ];

  const { rows } = await db.query(query, values);
  return rows[0];
};

const getReadings = async ({ station_id, limit = 100, offset = 0, start_date, end_date }) => {
  let query = 'SELECT * FROM water_quality_readings WHERE 1=1';
  const params = [];
  let paramIndex = 1;

  if (station_id) {
    query += ` AND station_id = $${paramIndex}`;
    params.push(station_id);
    paramIndex++;
  }

  if (start_date) {
    query += ` AND timestamp >= $${paramIndex}`;
    params.push(start_date);
    paramIndex++;
  }

  if (end_date) {
    query += ` AND timestamp <= $${paramIndex}`;
    params.push(end_date);
    paramIndex++;
  }

  query += ` ORDER BY timestamp DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  params.push(limit, offset);

  const { rows } = await db.query(query, params);
  
  // Get total count for pagination (approximate for large tables)
  // For precise pagination in large time-series, count queries can be slow.
  // We'll skip total count for this MVP iteration or do a separate simple count if needed.
  
  return rows;
};

const getReadingById = async (id) => {
  const query = 'SELECT * FROM water_quality_readings WHERE id = $1';
  const { rows } = await db.query(query, [id]);
  return rows[0];
};

module.exports = {
  addReading,
  getReadings,
  getReadingById
};
