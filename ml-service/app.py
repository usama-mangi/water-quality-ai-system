from flask import Flask, request, jsonify
from model import AnomalyDetector
import os

app = Flask(__name__)
detector = AnomalyDetector()

# Load model or train a dummy one for MVP
if not detector.load():
    print("No model found, training dummy model...")
    # Dummy training data
    X_train = [
        {'ph': 7.2, 'dissolved_oxygen': 8.5, 'temperature': 22.0, 'turbidity': 2.1, 'conductivity': 450},
        {'ph': 7.1, 'dissolved_oxygen': 8.4, 'temperature': 22.1, 'turbidity': 2.2, 'conductivity': 455},
        {'ph': 7.3, 'dissolved_oxygen': 8.6, 'temperature': 21.9, 'turbidity': 2.0, 'conductivity': 445},
    ] * 20
    detector.train(X_train)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'service': 'ml-service'})

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        if not data:
            return jsonify({'error': 'No data provided'}), 400
            
        result = detector.detect(data)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/train', methods=['POST'])
def train():
    try:
        data = request.json
        if not data or not isinstance(data, list):
            return jsonify({'error': 'Invalid training data format'}), 400
            
        detector.train(data)
        return jsonify({'message': 'Model retrained successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
