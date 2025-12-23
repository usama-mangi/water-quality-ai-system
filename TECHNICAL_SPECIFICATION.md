# Technical Specification: Water Quality AI Monitoring System

**Document Version:** 1.0  
**Last Updated:** 2025-12-22  
**Document Status:** APPROVED

---

## 1. Executive Summary

The Water Quality AI Monitoring System is an intelligent, real-time monitoring platform designed to assess, predict, and manage water quality across multiple water bodies. Leveraging advanced machine learning algorithms, IoT sensors, and cloud infrastructure, the system provides actionable insights for water quality management, environmental protection, and public health safeguards.

**Key Objectives:**

- Continuous monitoring of critical water quality parameters
- Real-time anomaly detection and alerting
- Predictive modeling for water quality trends
- Data-driven decision support for water resource management
- Accessibility to stakeholders via intuitive web and mobile interfaces

---

## 2. System Architecture

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐ │ Presentation Layer │ │ (Web Portal, Mobile App, Dashboards) │ └──────────────────┬──────────────────────────────────────────┘ │ ┌──────────────────▼──────────────────────────────────────────┐ │ API Gateway & Services │ │ (REST APIs, WebSockets, Real-time Data Feed) │ └──────────────────┬──────────────────────────────────────────┘ │ ┌──────────────────▼──────────────────────────────────────────┐ │ Business Logic Layer │ │ (Data Processing, ML Models, Analytics Engine) │ └──────────────────┬──────────────────────────────────────────┘ │ ┌──────────────────▼──────────────────────────────────────────┐ │ Data Layer │ │ (Time-Series DB, Cache, Storage) │ └──────────────────┬──────────────────────────────────────────┘ │ ┌──────────────────▼──────────────────────────────────────────┐ │ IoT & Sensors Layer │ │ (Sensor Networks, Data Collectors) │ └─────────────────────────────────────────────────────────────┘
```

### 2.2 Component Breakdown

#### 2.2.1 Sensor & Data Collection Layer

- **Hardware Sensors:** pH, dissolved oxygen (DO), turbidity, temperature, conductivity, chlorophyll-a, ammonia, nitrates
- **Data Collection Devices:** Edge computing gateways with built-in data validation
- **Communication Protocol:** MQTT, CoAP, and LTE for reliable data transmission
- **Sampling Frequency:** Configurable (1 minute to 1 hour intervals)

#### 2.2.2 Data Ingestion & Processing

- **Message Queue:** Apache Kafka for high-throughput data streaming
- **Stream Processing:** Apache Spark Streaming for real-time data transformation
- **Data Validation:** Automated quality checks and outlier detection
- **Throughput Capacity:** 10,000+ events per second

#### 2.2.3 Data Storage

- **Time-Series Database:** InfluxDB for efficient time-series data storage
- **Document Store:** MongoDB for flexible metadata and configuration storage
- **Cache Layer:** Redis for high-speed data retrieval and session management
- **Archive Storage:** AWS S3 for long-term historical data storage
- **Retention Policy:** Raw data (90 days), Aggregated data (2 years)

#### 2.2.4 Analytics & Machine Learning Layer

- **ML Framework:** TensorFlow and Scikit-learn
- **Models Implemented:**
  - Time-series forecasting (LSTM networks)
  - Anomaly detection (Isolation Forest, One-class SVM)
  - Water quality classification (Random Forest)
  - Pollution source prediction (Gradient Boosting)
- **Model Training:** Weekly batch updates with continuous validation
- **Inference Engine:** Real-time predictions with <1 second latency

#### 2.2.5 API & Integration Layer

- **REST API:** RESTful endpoints for CRUD operations
- **GraphQL API:** Advanced query capabilities for complex data requirements
- **WebSocket Server:** Real-time data streaming to clients
- **Authentication:** OAuth 2.0, JWT tokens
- **Rate Limiting:** API throttling to prevent abuse

#### 2.2.6 Presentation Layer

- **Web Dashboard:** React-based SPA with D3.js/Chart.js visualizations
- **Mobile Application:** Native apps for iOS and Android
- **Reporting Engine:** Automated PDF report generation
- **Notification System:** Push notifications, SMS, Email alerts

---

## 3. Technical Stack

### 3.1 Backend Technologies

- **Language:** Python 3.9+, Node.js 16+
- **Web Framework:** Django/Flask (Python), Express.js (Node.js)
- **Database:** PostgreSQL, InfluxDB, MongoDB, Redis
- **Message Queue:** Apache Kafka
- **Stream Processing:** Apache Spark
- **ML/AI:** TensorFlow 2.x, PyTorch, Scikit-learn
- **Containerization:** Docker, Kubernetes
- **Cloud Platform:** AWS (EC2, RDS, S3, Lambda)

### 3.2 Frontend Technologies

- **Framework:** React 18+
- **State Management:** Redux, Redux Toolkit
- **Visualization:** D3.js, Chart.js, Leaflet (maps)
- **Testing:** Jest, React Testing Library
- **Build Tool:** Webpack, Vite
- **CSS:** Tailwind CSS, SCSS

### 3.3 DevOps & Infrastructure

- **Container Orchestration:** Kubernetes
- **CI/CD:** GitHub Actions, Jenkins
- **Monitoring:** Prometheus, Grafana, ELK Stack
- **Logging:** ELK Stack (Elasticsearch, Logstash, Kibana)
- **IaC:** Terraform

---

## 4. API Specifications

### 4.1 Core Endpoints

#### Water Quality Data

```
GET /api/v1/water-quality/readings # List readings with filters
GET /api/v1/water-quality/readings/: id # Get specific reading
POST /api/v1/water-quality/readings # Create new reading
PUT /api/v1/water-quality/readings/: id # Update reading
DELETE /api/v1/water-quality/readings/:id # Delete reading
```

#### Monitoring Stations

```
GET /api/v1/stations # List all stations
GET /api/v1/stations/:id # Get station details
POST /api/v1/stations # Create new station
PUT /api/v1/stations/:id # Update station
DELETE /api/v1/stations/:id # Delete station
```

#### Alerts & Notifications

```
GET /api/v1/analytics/summary # Get summary statistics
GET /api/v1/analytics/trends/: station_id # Get quality trends
GET /api/v1/analytics/predictions # Get ML predictions
GET /api/v1/reports/generate # Generate PDF report
```

### 4.2 Request/Response Format

**Request Example:**

```json
{
  "method": "GET",
  "url": "/api/v1/water-quality/readings? station_id=STN001&limit=100",
  "headers": {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "Content-Type": "application/json"
  }
}
```

**Response Example (Success):**

```json
{
  "status": 200,
  "message": "Success",
  "data": {
    "readings": [
      {
        "id": "RDG001",
        "station_id": "STN001",
        "timestamp": "2025-12-22T23:46:54Z",
        "parameters": {
          "ph": 7.2,
          "dissolved_oxygen": 8.5,
          "temperature": 22.3,
          "turbidity": 2.1,
          "conductivity": 450
        },
        "quality_index": 82. 5,
        "status": "GOOD",
        "anomaly_score": 0.12,
        "is_anomaly": false
      }
    ],
    "pagination": {
      "total":  1000,
      "limit": 100,
      "offset": 0
    }
  },
  "timestamp": "2025-12-22T23:46:54Z"
}
```

**Response Example (Error):**

```json
{
  "status": 400,
  "message": "Invalid station_id",
  "error": {
    "code": "INVALID_PARAMETER",
    "field": "station_id"
  },
  "timestamp": "2025-12-22T23:46:54Z"
}
```

---

## 5. Data Models

### 5.1 Core Database Entities

**Water Quality Reading (Time-Series Data)**

```yaml
WaterQualityReading:
  id: UUID (Primary Key)
  station_id: String (Foreign Key → Station)
  timestamp: DateTime (indexed)
  parameters:
    ph: Float (0-14)
    dissolved_oxygen: Float (mg/L)
    temperature: Float (°C)
    turbidity: Float (NTU)
    conductivity: Float (µS/cm)
    ammonia: Float (mg/L)
    nitrates: Float (mg/L)
    chlorophyll_a: Float (mg/m³)
  quality_index: Float (0-100)
  quality_status: Enum (EXCELLENT, GOOD, FAIR, POOR, CRITICAL)
  anomaly_score: Float (0-1)
  is_anomaly: Boolean
  created_at: DateTime
  updated_at: DateTime
```

**Monitoring Station**

```yaml
Station:
  id: String (Primary Key)
  name: String
  description: String (optional)
  location:
    latitude: Float
    longitude: Float
    address: String
    water_body: String
  sensors: Array[String] (sensor IDs)
  status: Enum (ACTIVE, INACTIVE, MAINTENANCE)
  owner: String (Foreign Key → User)
  last_reading: DateTime
  alert_enabled: Boolean
  alert_thresholds: Object
  created_at: DateTime
  updated_at: DateTime
```

**Alert Configuration & History**

```yaml
Alert:
  id: UUID (Primary Key)
  station_id: String (Foreign Key)
  alert_type: Enum (THRESHOLD_EXCEEDED, ANOMALY_DETECTED, SENSOR_FAILURE)
  severity: Enum (LOW, MEDIUM, HIGH, CRITICAL)
  description: String
  parameter: String
  threshold_value: Float
  actual_value: Float
  status: Enum (OPEN, ACKNOWLEDGED, RESOLVED)
  recipients: Array[String] (email/phone)
  triggered_at: DateTime
  acknowledged_at: DateTime
  resolved_at: DateTime
  notes: String (optional)
```

**User & Authentication**

```yaml
User:
  id: UUID (Primary Key)
  username: String (unique)
  email: String (unique)
  password_hash: String
  role: Enum (ADMIN, MANAGER, ANALYST, VIEWER)
  organization: String
  phone: String (optional)
  is_active: Boolean
  last_login: DateTime
  created_at: DateTime
  updated_at: DateTime
```

---

## 6. Machine Learning Models

### 6.1 Anomaly Detection Model

**Algorithm:** Isolation Forest
**Input Features:** All water quality parameters (pH, DO, temperature, turbidity, conductivity)
**Output:** Anomaly score (0-1), Boolean flag for anomaly
**Training Data:** 90 days of historical readings per station
**Update Frequency:** Weekly
**Performance Target:**

- False Positive Rate: < 2%
- Detection Latency: < 100ms
- Model Accuracy: > 90%

**Implementation:**

```python
from sklearn.ensemble import IsolationForest
import numpy as np

# Train model
model = IsolationForest(contamination=0.02, random_state=42)
model.fit(training_data)

# Real-time prediction
anomaly_score = model.decision_function([[ph, do, temp, turbidity, conductivity]])
is_anomaly = model.predict([[... ]])[0] == -1
``
```

### 6.2 Time-Series Forecasting Model

**Algorithm**: LSTM (Long Short-Term Memory) Neural Network
**Purpose**: Predict water quality parameters 7-30 days ahead
**Input**: Historical readings (previous 60 days)
**Output**: Predicted parameter values + 95% confidence intervals
**Update Frequency**: Weekly
**Performance Target**:

- RMSE: < 5% of parameter range
- MAPE: < 8%
- Prediction Horizon: 7-30 days

**Implementation:**

```python
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout

model = Sequential([
    LSTM(64, activation='relu', input_shape=(60, 5), return_sequences=True),
    Dropout(0.2),
    LSTM(32, activation='relu'),
    Dropout(0.2),
    Dense(16, activation='relu'),
    Dense(5)  # Predict 5 parameters
])

model.compile(optimizer='adam', loss='mse')
```

### 6.3 Water Quality Classification Model

**Algorithm**: Random Forest Classifier
**Purpose**: Classify water quality status
**Input Features**: All sensor parameters + temporal features
**Output**: Quality status (EXCELLENT, GOOD, FAIR, POOR, CRITICAL)
**Training Data**: Labeled historical readings
**Update Frequency**: Weekly
**Performance Target**:

- Accuracy: > 92%
- Precision: > 0.90
- Recall: > 0.85
- F1-Score: > 0.87

---

## 7. Database Schema

### 7.1 PostgreSQL Schema (TimescaleDB)

```sql
-- Enable TimescaleDB extension
CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;

-- Monitoring Stations table
CREATE TABLE stations (
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
CREATE TABLE water_quality_readings (
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
CREATE TABLE alerts (
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
CREATE TABLE users (
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
CREATE INDEX idx_readings_station_timestamp ON water_quality_readings (station_id, timestamp DESC);
CREATE INDEX idx_readings_timestamp ON water_quality_readings (timestamp DESC);
CREATE INDEX idx_alerts_station ON alerts (station_id);
CREATE INDEX idx_alerts_status ON alerts (status);
CREATE INDEX idx_users_email ON users (email);
```

---

## 8. Security Specifications

### 8.1 Authentication & Authorization

- Method: OAuth 2.0 + JWT (JSON Web Tokens)
- Token Format: RS256 (RSA signature)
- Access Token Expiry: 1 hour
- Refresh Token Expiry: 7 days
- Password Policy: Minimum 8 characters, uppercase, lowercase, numbers, special chars

**JWT Payload Example:**

```json
{
  "sub": "user_id_123",
  "email": "user@example.com",
  "role": "ANALYST",
  "iat": 1703281614,
  "exp": 1703285214
}
```

### 8.2 Role-Based Access Control (RBAC)

| Role    | Permissions                                               |
| ------- | --------------------------------------------------------- |
| ADMIN   | Full system access, user management, system configuration |
| MANAGER | Station management, alert configuration, user invitations |
| ANALYST | View data, generate reports, configure dashboards         |
| VIEWER  | Read-only access to public dashboards                     |

### 8.3 Data Encryption

- **At Rest**: AES-256-GCM encryption for sensitive fields
- **In Transit**: TLS 1.3 for all API endpoints
- **Database**: PostgreSQL encrypted with Transparent Data Encryption (TDE)

### 8.4 API Security

- **Rate Limiting**: 1000 requests/hour per API key
- **CORS**: Whitelist specific domains
- **CSRF Protection**: Double-submit cookies
- **SQL Injection Prevention**: Parameterized queries
- **XSS Prevention**: HTML escaping, Content Security Policy headers

---

## 9. Performance Requirements

### 9.1 Scalability Targets

- **Concurrent Users**: 1,000+ (MVP), 10,000+ (production)
- **Data Ingestion**: 1,000 readings/second (MVP), 10,000+ (production)
- **API Response Time**: < 500ms (p95)
- **Database Query Response**: < 200ms (p95)
- **Real-time Latency**: < 2 seconds from sensor to dashboard

### 9.2 Availability & Reliability

- **Target SLA**: 99.5% uptime
- **Recovery Time Objective (RTO)**: < 1 hour
- **Recovery Point Objective (RPO)**: < 15 minutes
- **Data Backup**: Daily automated backups, 30-day retention

### 9.3 Load Testing Thresholds

- **Normal Load**: 100 requests/second
- **Peak Load**: 500 requests/second
- **Stress Test**: 1,000 requests/second
- **Cache Hit Ratio Target**: > 80%

---

## 10. Deployment Architecture

### 10.1 MVP Deployment (Docker Compose)

**Environment:**

- Single EC2 instance (t3.large) or Railway. app
- Docker Compose orchestration
- PostgreSQL 14 container
- Redis container
- Backend (Express.js) container
- Frontend (React) container
- Nginx reverse proxy container

**Directory Structure:**

```
water-quality-ai-system/
├── docker-compose.yml
├── . env.example
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── src/
│   │   ├── api/
│   │   ├── models/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   └── utils/
│   └── requirements.txt (for ML models)
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   └── utils/
│   └── public/
├── ml-service/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── models/
│   └── api. py
└── nginx/
    └── nginx.conf
```

### 10.2 Production Deployment (Kubernetes)

**Infrastructure:**

- 5+ node Kubernetes cluster (AWS EKS or DigitalOcean)
- RDS PostgreSQL (managed, multi-AZ)
- ElastiCache Redis cluster
- AWS S3 for backups
- CloudFront CDN for static assets
- Route 53 for DNS

**Deployment Strategy:**

- Blue-Green deployments for zero-downtime updates
- Rolling updates with 30% max surge
- Health checks every 10 seconds
- Automatic rollback on failed deployments

---

## 11. Monitoring & Logging

### 11.1 Metrics Collection

**System Metrics:**

- CPU utilization (target: < 70%)
- Memory usage (target: < 80%)
- Disk I/O operations
- Network latency (p95 < 50ms)
- Container restart count

**Application Metrics:**

- API request latency (p50, p95, p99)
- Error rate (target: < 0.1%)
- Database query latency
- Cache hit ratio
- WebSocket connection count

**ML Model Metrics:**

- Prediction latency
- Model accuracy drift
- Anomaly detection rate
- Forecast error (RMSE, MAPE)

**Tool:** Prometheus with Grafana dashboards

### 11.2 Logging Architecture

**Log Levels:**

- **ERROR**: System errors, failed operations
- **WARN**: Unusual conditions, retry attempts
- **INFO**: Key business events, API calls
- **DEBUG**: Detailed execution flow (dev only)

**Log Format (JSON):**

```json
{
  "timestamp": "2025-12-22T23:46:54Z",
  "level": "INFO",
  "service": "api-server",
  "event": "water_quality_reading_created",
  "station_id": "STN001",
  "user_id": "USR123",
  "duration_ms": 45,
  "status": 201
}
```

**Retention:**

- **Hot storage (live):** 7 days
- **Cold storage (archived):** 90 days
- **Compliance:** GDPR-compliant data deletion

**Tool**: Winston (Node.js), Python logging + ELK Stack (production)

---

## 12. Testing Strategy

### 12.1 Unit Testing

- **Coverage:** > 80% of codebase
- **Framework:** Jest (JavaScript), Pytest (Python)
- **Execution:** On every commit via CI/CD
- **Mock/Stub:** Sinon.js, unittest.mock

## 12.2 Integration Testing

- **Scope:** API endpoints, database interactions, service integrations
- **Framework:** Postman/Newman, Pytest
- **Test Data:** Isolated test database
- **Execution:** Daily via scheduled job

### 12.3 Performance Testing

- **Tool:** Apache JMeter or Locust
- **Scenarios:**

  - **Load test:** 500 RPS for 5 minutes
  - **Stress test:** Gradually increase to 1,000 RPS
  - **Spike test:** Sudden spike to 2,000 RPS
  - **Success Criteria:** p95 latency < 1 second
  - **Frequency:** Before production releases

### 12.4 Security Testing

- **Penetration Testing:** Quarterly
- **Dependency Scanning:** Weekly via Snyk/Dependabot
- **OWASP Top 10:** Manual and automated testing
- **Tools:** OWASP ZAP, Burp Suite Community

---

## 13. Development Timeline (35 hours)

### Week 1: MVP Development

#### Day 1-2 (10 hours): Backend & Database Setup

- PostgreSQL setup with TimescaleDB
- Express.js/FastAPI project scaffold
- User authentication & JWT implementation
- Water quality and station endpoints
- Initial Dockerfile setup

#### Day 3 (7 hours): Frontend & Real-time

- React project setup (Vite)
- Dashboard layout and navigation
- Station map component
- Chart.js for metrics visualization
- WebSocket integration for real-time data

#### Day 4 (10 hours): ML Integration & Alerts

- Isolation Forest anomaly detection model
- Model integration with backend API
- Alert system implementation
- Email/push notification service
- ML inference pipeline (< 100ms latency)

#### Day 5 (8 hours): Polish & Deployment

- UI/UX refinement and responsive design
- Performance optimization
- Docker Compose setup and testing
- Deploy to Railway/Render
- README and basic documentation

---

## 14. Success Metrics (Definition of Done)

### Functional Requirements

- ✅ Real-time water quality data ingestion (100+ readings/second)
- ✅ Dashboard with live metrics and alerts
- ✅ ML anomaly detection with < 2% false positive rate
- ✅ API fully documented (Swagger/OpenAPI)
- ✅ Authentication & authorization working
- ✅ Email/SMS alerts functional
- ✅ Responsive design (mobile, tablet, desktop)

### Non-Functional Requirements

- ✅ API response time < 500ms (p95)
- ✅ Database uptime 99%
- ✅ Code coverage > 70%
- ✅ No SQL injection vulnerabilities
- ✅ All secrets in environment variables
- ✅ CI/CD pipeline automated

### Portfolio Quality

- ✅ GitHub repo with clear README
- ✅ Architecture diagrams
- ✅ Live demo link
- ✅ Deployment guide
- ✅ Sample data for testing
- ✅ Blog post or demo video

---

## 15. Known Limitations & Future Enhancements

### Current Limitations (MVP)

- Simulated sensor data (not real IoT devices)
- Single region deployment
- Basic anomaly detection algorithm
- No offline mode for mobile app
- Limited historical data queries (30-day limit)

### Planned Enhancements

- **Phase 2:** Real IoT device integration, multi-region support
- **Phase 3:** Advanced ML (deep learning, reinforcement learning)
- **Phase 4:** Mobile app (React Native)
- **Phase 5:** Satellite imagery integration, species detection

---

## 16. Glossary

| Term             | Definition                                                                   |
| ---------------- | ---------------------------------------------------------------------------- |
| DO               | Dissolved Oxygen - amount of oxygen in water; critical for aquatic life      |
| pH               | Power of Hydrogen - measure of water acidity/alkalinity (0-14)               |
| Turbidity        | Measure of water clarity; suspended particles reduce light penetration       |
| Conductivity     | Measure of water's ability to conduct electricity; indicates dissolved salts |
| Chlorophyll-a    | Green pigment in algae; indicates algal bloom presence                       |
| Hypertable       | TimescaleDB abstraction for managing large time-series datasets              |
| Isolation Forest | Unsupervised ML algorithm for anomaly detection                              |
| LSTM             | Long Short-Term Memory neural network for time-series prediction             |
| RTO              | Recovery Time Objective - maximum acceptable downtime                        |
| RPO              | Recovery Point Objective - maximum acceptable data loss                      |

## 17. Appendix: Code Templates

### 17.1 Example API Endpoint (Express.js)

```javascript
// routes/waterQuality.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const db = require("../db");

// GET water quality readings with filters
router.get("/readings", auth, async (req, res) => {
  try {
    const {
      station_id,
      limit = 100,
      offset = 0,
      start_date,
      end_date,
    } = req.query;

    let query = "SELECT * FROM water_quality_readings WHERE 1=1";
    const params = [];

    if (station_id) {
      query += " AND station_id = $" + (params.length + 1);
      params.push(station_id);
    }

    if (start_date) {
      query += " AND timestamp >= $" + (params.length + 1);
      params.push(new Date(start_date));
    }

    if (end_date) {
      query += " AND timestamp <= $" + (params.length + 1);
      params.push(new Date(end_date));
    }

    query +=
      " ORDER BY timestamp DESC LIMIT $" +
      (params.length + 1) +
      " OFFSET $" +
      (params.length + 2);
    params.push(limit, offset);

    const result = await db.query(query, params);

    res.json({
      status: 200,
      message: "Success",
      data: {
        readings: result.rows,
        pagination: { total: result.rowCount, limit, offset },
      },
    });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
});

// POST create new reading
router.post("/readings", auth, async (req, res) => {
  try {
    const { station_id, parameters } = req.body;

    const query = `
      INSERT INTO water_quality_readings
      (station_id, ph, dissolved_oxygen, temperature, turbidity, conductivity, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING *
    `;

    const result = await db.query(query, [
      station_id,
      parameters.ph,
      parameters.dissolved_oxygen,
      parameters.temperature,
      parameters.turbidity,
      parameters.conductivity,
    ]);

    res.status(201).json({
      status: 201,
      message: "Reading created successfully",
      data: result.rows[0],
    });
  } catch (error) {
    res.status(400).json({ status: 400, message: error.message });
  }
});

module.exports = router;
```

### 17.2 Example ML Model (Python)

```python
# ml_service/anomaly_detector.py
from sklearn.ensemble import IsolationForest
import numpy as np
import joblib
from datetime import datetime, timedelta
import psycopg2

class AnomalyDetector:
    def __init__(self, contamination=0.02):
        self.model = IsolationForest(contamination=contamination, random_state=42)
        self.training_data = []
        self.features = ['ph', 'dissolved_oxygen', 'temperature', 'turbidity', 'conductivity']

    def fetch_training_data(self, station_id, days=90):
        """Fetch last 90 days of data from database"""
        conn = psycopg2.connect("dbname=waterquality user=postgres")
        cur = conn.cursor()

        query = """
            SELECT ph, dissolved_oxygen, temperature, turbidity, conductivity
            FROM water_quality_readings
            WHERE station_id = %s AND timestamp >= NOW() - INTERVAL '%s days'
            ORDER BY timestamp
        """

        cur. execute(query, (station_id, days))
        rows = cur.fetchall()
        conn.close()

        return np.array(rows)

    def train(self, station_id):
        """Train model on historical data"""
        data = self.fetch_training_data(station_id)
        if len(data) > 10:
            self.model.fit(data)
            joblib.dump(self.model, f'models/{station_id}_anomaly_model.pkl')

    def detect_anomaly(self, reading):
        """Detect anomaly in new reading"""
        features = np. array([[
            reading['ph'],
            reading['dissolved_oxygen'],
            reading['temperature'],
            reading['turbidity'],
            reading['conductivity']
        ]])

        anomaly_score = self.model. decision_function(features)[0]
        is_anomaly = self.model.predict(features)[0] == -1

        return {
            'is_anomaly': bool(is_anomaly),
            'anomaly_score': float(abs(anomaly_score))
        }

# Example usage
detector = AnomalyDetector()
detector.train('STN001')
result = detector.detect_anomaly({'ph':  7.2, 'dissolved_oxygen': 8.5, ... })
print(f"Anomaly:  {result['is_anomaly']}, Score: {result['anomaly_score']}")
```
