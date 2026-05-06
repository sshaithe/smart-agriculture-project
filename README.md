# Smart Agriculture System

A comprehensive full-stack application that leverages Machine Learning to help farmers and agricultural professionals make data-driven decisions. The system provides insights into crop recommendations, yield predictions, plant disease detection, and environmental risk assessments.

## 🚀 Features

- **Crop Recommendation**: Suggests the optimal crop to plant based on soil metrics (Nitrogen, Phosphorus, Potassium, pH) and environmental factors (Temperature, Humidity, Rainfall).
- **Yield Prediction**: Predicts agricultural yield (in kg/ha) using historical FAOSTAT data combined with regional climate suitability multipliers for highly localized accuracy.
- **Plant Disease Detection**: Uses a trained Convolutional Neural Network (CNN) to analyze uploaded images of plant leaves and identify diseases, providing confidence scores and treatment recommendations.
- **Environmental Risk Engine**: A rule-based system that analyzes real-time weather and soil data to alert users to potential risks such as heat stress, frost, drought, and heavy rainfall.

## 🛠️ Technology Stack

- **Frontend**: React.js
- **Backend**: Python, Flask, SQLAlchemy (SQLite Database)
- **Machine Learning**: TensorFlow/Keras (for Deep Learning/CNNs), Scikit-Learn (for Random Forest/Decision Trees), Pandas, NumPy

## 📁 Project Structure

- `/frontend`: Contains the React frontend application.
- `/backend`: Contains the Flask API server, controllers, and database configurations.
- `/model`: Contains the Machine Learning models, preprocessors, inference scripts (`predict_*.py`), and training scripts.
  - `/model/models`: Serialized `.pkl` and `.keras` model files used by the backend.
  - `/model/src`: Source code for prediction endpoints and model training.

## ⚙️ Setup and Installation

### 1. Backend Setup

1. Navigate to the `backend` directory.
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On Mac/Linux:
   source venv/bin/activate
   ```
3. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the Flask development server:
   ```bash
   python wsgi.py
   ```
   *(The SQLite database `smart_agriculture_db.db` will be created automatically.)*

### 2. Frontend Setup

1. Navigate to the `frontend/smart_agriculture_frontend` directory.
2. Install Node.js dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm.cmd run dev
   ```
   *(Or `npm start` depending on your setup)*

## ✅ Testing

1. Install test dependencies:
   ```bash
   pip install -r requirements-test.txt
   ```
2. Run the test suite:
   ```bash
   pytest
   ```

## 🧠 Machine Learning Models
The application relies on several trained models located in `model/models/`. 

*Note: Ensure TensorFlow is installed if you intend to run or retrain the Disease Detection CNN model.*
