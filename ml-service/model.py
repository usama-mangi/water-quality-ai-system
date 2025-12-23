from sklearn.ensemble import IsolationForest
import numpy as np
import joblib
import os

class AnomalyDetector:
    def __init__(self, contamination=0.02):
        self.model = IsolationForest(contamination=contamination, random_state=42)
        self.features = ['ph', 'dissolved_oxygen', 'temperature', 'turbidity', 'conductivity']
        self.model_path = 'models/anomaly_model.pkl'

    def train(self, data):
        """
        Train model on historical data
        data: list of dictionaries or pandas DataFrame
        """
        # Convert to numpy array
        # Assuming data is a list of dicts with the feature keys
        X = [[d[f] for f in self.features] for d in data]
        self.model.fit(X)
        
        # Save model
        os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
        joblib.dump(self.model, self.model_path)
        print("Model trained and saved.")

    def load(self):
        if os.path.exists(self.model_path):
            self.model = joblib.load(self.model_path)
            return True
        return False

    def detect(self, reading):
        """
        Detect anomaly in new reading
        reading: dictionary
        """
        features = np.array([[
            reading.get('ph', 7.0),
            reading.get('dissolved_oxygen', 8.0),
            reading.get('temperature', 20.0),
            reading.get('turbidity', 5.0),
            reading.get('conductivity', 500.0)
        ]])

        # decision_function returns anomaly score (negative = anomaly)
        # IsolationForest: lower score = more anomalous
        # But scikit-learn decision_function: positive for inliers, negative for outliers
        
        score = self.model.decision_function(features)[0]
        is_anomaly = self.model.predict(features)[0] == -1

        return {
            'is_anomaly': bool(is_anomaly),
            'anomaly_score': float(score) # Raw score
        }

# Create a dummy model for MVP if not exists
if __name__ == "__main__":
    detector = AnomalyDetector()
    # Dummy training data
    X_train = [
        {'ph': 7.2, 'dissolved_oxygen': 8.5, 'temperature': 22.0, 'turbidity': 2.1, 'conductivity': 450},
        {'ph': 7.1, 'dissolved_oxygen': 8.4, 'temperature': 22.1, 'turbidity': 2.2, 'conductivity': 455},
        {'ph': 7.3, 'dissolved_oxygen': 8.6, 'temperature': 21.9, 'turbidity': 2.0, 'conductivity': 445},
        # ... add more normal data
    ] * 10
    detector.train(X_train)
