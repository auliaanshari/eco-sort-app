# backend-python/app.py

import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image, ImageOps 
import tensorflow as tf
import numpy as np
import io
load_dotenv()
# Inisialisasi aplikasi Flask
app = Flask(__name__)


# --- Konfigurasi CORS ---
# Ambil URL frontend dari environment variable saat production
# Jika tidak ada (saat development), izinkan dari localhost
FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:5173') 
CORS(app, resources={r"/api/*": {"origins": FRONTEND_URL}})

# --- Pemuatan Model dan Label ---
MODEL_PATH = os.getenv('MODEL_PATH', 'keras_model.h5')
LABELS_PATH = os.getenv('LABELS_PATH', 'labels.txt')

try:
    model = tf.keras.models.load_model(MODEL_PATH, compile=False) 
    # Membaca file label
    with open(LABELS_PATH, 'r') as f:
        class_names = [line.rstrip() for line in f.readlines()]

except Exception as e:
    app.logger.error(f"Failed to load model or labels: {e}")
    model = None
    class_names = []

# --- Fungsi Helper ---
def preprocess_image(image_bytes):
    data = np.ndarray(shape=(1, 224, 224, 3), dtype=np.float32)
    image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    size = (224, 224)
    image = ImageOps.fit(image, size, Image.Resampling.LANCZOS)
    image_array = np.asarray(image)
    normalized_image_array = (image_array.astype(np.float32) / 127.5) - 1
    data[0] = normalized_image_array
    return data

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# --- Endpoint API ---
@app.route('/api/classify', methods=['POST'])
def classify_image():
    if model is None or not class_names:
        return jsonify({'error': 'Model or labels not loaded'}), 500
    
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400
        
    file = request.files['image']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    # Validasi tipe file untuk keamanan
    if not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file type. Please use PNG, JPG, or JPEG'}), 400

    try:
        image_bytes = file.read()

        # Validasi ukuran file (misal: maks 5MB)
        if len(image_bytes) > 5 * 1024 * 1024:
            return jsonify({'error': 'File size exceeds the 5MB limit'}), 400
        
        processed_image = preprocess_image(image_bytes)
        prediction = model.predict(processed_image, verbose=0)
        predicted_class_index = np.argmax(prediction)
        
        raw_class_name = class_names[predicted_class_index]
        clean_class_name = " ".join(raw_class_name.split(' ')[1:])

        confidence_score = float(prediction[0][predicted_class_index])
        
        return jsonify({
            'classification': clean_class_name,
            'confidence': confidence_score
        })
        
    except Exception as e:
        app.logger.error(f"Error processing image: {e}")
        return jsonify({'error': 'Failed to process image'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)