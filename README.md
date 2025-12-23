# Water Quality AI Monitoring System

An intelligent, real-time monitoring platform for water quality assessment and anomaly detection.

## Architecture

- **Backend:** Node.js (Express.js) - REST API & WebSockets
- **Frontend:** React (Vite, Tailwind CSS, Redux Toolkit)
- **ML Service:** Python (Flask, Scikit-learn) - Isolation Forest Anomaly Detection
- **Database:** PostgreSQL with TimescaleDB
- **Cache:** Redis
- **Reverse Proxy:** Nginx

## Prerequisites

- Docker and Docker Compose

## Getting Started

1. Clone the repository
2. Create a `.env` file in the root based on `.env.example`
3. Start the system:
   ```bash
   docker-compose up --build
   ```
4. Access the dashboard at `http://localhost`

## API Documentation

- Auth: `/api/v1/auth`
- Stations: `/api/v1/stations`
- Water Quality: `/api/v1/water-quality`
- Alerts: `/api/v1/alerts`

## Machine Learning

The system uses an Isolation Forest model to detect anomalies in real-time. Features include pH, Dissolved Oxygen, Temperature, Turbidity, and Conductivity.
