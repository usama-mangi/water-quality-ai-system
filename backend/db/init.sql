-- Enable TimescaleDB extension
CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;

-- Monitoring Stations table
CREATE TABLE IF NOT EXISTS stations (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  address VARCHAR(500),
  water_body VARCHAR(255),
  status VARCHAR(50) DEFAULT 'ACTIVE',
  owner_id UUID NOT NULL,
  last_reading TIMESTAMP,
  alert_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Water Quality Readings (Time-Series)
CREATE TABLE IF NOT EXISTS water_quality_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  station_id VARCHAR(50) NOT NULL REFERENCES stations(id),
  timestamp TIMESTAMP NOT NULL,
  ph DECIMAL(4, 2),
  dissolved_oxygen DECIMAL(5, 2),
  temperature DECIMAL(5, 2),
  turbidity DECIMAL(8, 2),
  conductivity DECIMAL(8, 2),
  ammonia DECIMAL(6, 3),
  nitrates DECIMAL(6, 3),
  chlorophyll_a DECIMAL(8, 2),
  quality_index DECIMAL(5, 2),
  quality_status VARCHAR(50),
  anomaly_score DECIMAL(4, 3),
  is_anomaly BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Convert to TimescaleDB hypertable for better performance
SELECT create_hypertable('water_quality_readings', 'timestamp', if_not_exists => TRUE);

-- Alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  station_id VARCHAR(50) NOT NULL REFERENCES stations(id),
  alert_type VARCHAR(50) NOT NULL,
  severity VARCHAR(50) NOT NULL,
  description TEXT,
  parameter VARCHAR(50),
  threshold_value DECIMAL(10, 3),
  actual_value DECIMAL(10, 3),
  status VARCHAR(50) DEFAULT 'OPEN',
  recipients VARCHAR(500)[] DEFAULT ARRAY[]::VARCHAR[],
  triggered_at TIMESTAMP NOT NULL,
  acknowledged_at TIMESTAMP,
  resolved_at TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'VIEWER',
  organization VARCHAR(255),
  phone VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_readings_station_timestamp ON water_quality_readings (station_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_readings_timestamp ON water_quality_readings (timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_station ON alerts (station_id);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON alerts (status);
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
