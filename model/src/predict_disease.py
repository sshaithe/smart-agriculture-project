
import os
import io
import json
import numpy as np
from PIL import Image

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(os.path.dirname(os.path.dirname(SCRIPT_DIR)), "model", "models")

_tf = None
TF_AVAILABLE = None  

_model = None
_classes = []
_image_size = (224, 224)

def _ensure_tf():
    
    global _tf, TF_AVAILABLE
    if TF_AVAILABLE is None:
        try:
            import tensorflow as tf
            _tf = tf
            TF_AVAILABLE = True
        except ImportError:
            TF_AVAILABLE = False
    return TF_AVAILABLE


DISEASE_INFO = {
    "Apple___Apple_scab": {
        "cause": "Caused by the fungus Venturia inaequalis. Spreads through wind and rain splashing spores from infected fallen leaves.",
        "treatment": "Apply captan or myclobutanil fungicide at bud break. Remove and destroy fallen infected leaves. Prune trees to improve air circulation.",
        "prevention": "Plant scab-resistant apple varieties. Rake and destroy fallen leaves in autumn. Apply preventive fungicide sprays during wet spring weather."
    },
    "Apple___Black_rot": {
        "cause": "Caused by the fungus Botryosphaeria obtusa. Infects through wounds in bark and spreads in warm, humid conditions.",
        "treatment": "Prune out cankers and dead wood at least 15 cm below visible infection. Apply captan or thiophanate-methyl fungicide. Remove mummified fruit from tree and ground.",
        "prevention": "Maintain good tree hygiene. Remove all dead wood and mummified fruit. Ensure proper pruning to improve air flow."
    },
    "Apple___Cedar_apple_rust": {
        "cause": "Caused by the fungus Gymnosporangium juniperi-virginianae. Requires both apple and cedar/juniper trees to complete its life cycle.",
        "treatment": "Apply myclobutanil or mancozeb fungicide in spring when orange spore horns appear on cedars. Remove galls from nearby junipers if possible.",
        "prevention": "Plant rust-resistant apple varieties. Remove nearby juniper and red cedar trees within 2-3 km radius. Apply preventive fungicide in early spring."
    },
    "Apple___healthy": {
        "cause": "No disease detected.",
        "treatment": "No treatment needed. Plant appears healthy. Continue regular care and monitoring.",
        "prevention": "Maintain balanced fertilization, proper watering, and regular pruning for continued plant health."
    },
    "Blueberry___healthy": {
        "cause": "No disease detected.",
        "treatment": "No treatment needed. Plant appears healthy. Continue regular care and monitoring.",
        "prevention": "Maintain acidic soil (pH 4.5-5.5), proper mulching, and adequate watering for continued plant health."
    },
    "Cherry_(including_sour)___Powdery_mildew": {
        "cause": "Caused by the fungus Podosphaera clandestina. Thrives in warm, dry climates with cool nights and high humidity.",
        "treatment": "Apply sulfur-based or potassium bicarbonate fungicide. Remove and destroy heavily infected shoots. Improve air circulation by pruning.",
        "prevention": "Avoid excessive nitrogen fertilization. Ensure proper spacing between trees. Apply preventive fungicide before symptoms appear."
    },
    "Cherry_(including_sour)___healthy": {
        "cause": "No disease detected.",
        "treatment": "No treatment needed. Plant appears healthy. Continue regular care and monitoring.",
        "prevention": "Maintain proper pruning schedule, balanced nutrition, and good drainage for continued plant health."
    },
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot": {
        "cause": "Caused by the fungus Cercospora zeae-maydis. Survives in crop residue and favored by warm, humid conditions with prolonged leaf wetness.",
        "treatment": "Apply strobilurin or triazole fungicides at early signs. Use crop rotation with non-host crops. Remove and destroy crop residue after harvest.",
        "prevention": "Plant resistant corn hybrids. Practice 2-year crop rotation. Use tillage to bury infected crop debris."
    },
    "Corn_(maize)___Common_rust_": {
        "cause": "Caused by the fungus Puccinia sorghi. Spreads via windborne spores and thrives in cool, humid conditions (15-25°C).",
        "treatment": "Apply triazole or strobilurin fungicide if infection is severe and detected early. Most commercial hybrids have adequate resistance.",
        "prevention": "Plant rust-resistant hybrids. Early planting to avoid peak spore season. Scout fields regularly during cool, wet periods."
    },
    "Corn_(maize)___Northern_Leaf_Blight": {
        "cause": "Caused by the fungus Exserohilum turcicum. Favored by moderate temperatures (18-27°C) and heavy dew or rain.",
        "treatment": "Apply foliar fungicides (azoxystrobin or propiconazole) at first sign of lesions. Remove and destroy infected crop residue.",
        "prevention": "Use resistant hybrids. Rotate crops (avoid corn-after-corn). Till crop debris to reduce inoculum."
    },
    "Corn_(maize)___healthy": {
        "cause": "No disease detected.",
        "treatment": "No treatment needed. Plant appears healthy. Continue regular care and monitoring.",
        "prevention": "Maintain proper crop rotation, balanced fertilization, and adequate spacing for continued plant health."
    },
    "Grape___Black_rot": {
        "cause": "Caused by the fungus Guignardia bidwellii. Thrives in warm, humid weather and infects all green parts of the vine.",
        "treatment": "Apply mancozeb or myclobutanil fungicide from bud break through fruit set. Remove and destroy mummified berries and infected leaves.",
        "prevention": "Remove all mummified fruit from vines and ground. Prune for good air circulation. Apply fungicides preventively during wet periods."
    },
    "Grape___Esca_(Black_Measles)": {
        "cause": "Caused by a complex of wood-decay fungi (Phaeomoniella, Phaeoacremonium, Fomitiporia). Enters through pruning wounds.",
        "treatment": "No effective chemical cure exists. Remove and destroy severely infected vines. Apply wound protectants to fresh pruning cuts.",
        "prevention": "Protect pruning wounds with fungicidal paste. Avoid large pruning cuts. Delay pruning until late winter to allow wound healing."
    },
    "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)": {
        "cause": "Caused by the fungus Pseudocercospora vitis (formerly Isariopsis). Favored by warm, humid conditions.",
        "treatment": "Apply copper-based fungicide or mancozeb. Remove infected leaves and improve canopy management. Ensure good air flow.",
        "prevention": "Practice leaf removal in the fruit zone. Avoid overhead irrigation. Apply preventive fungicides during rainy periods."
    },
    "Grape___healthy": {
        "cause": "No disease detected.",
        "treatment": "No treatment needed. Plant appears healthy. Continue regular care and monitoring.",
        "prevention": "Maintain proper canopy management, balanced nutrition, and regular scouting for continued plant health."
    },
    "Orange___Haunglongbing_(Citrus_greening)": {
        "cause": "Caused by the bacterium Candidatus Liberibacter. Transmitted by the Asian citrus psyllid (Diaphorina citri) insect.",
        "treatment": "No cure exists. Control psyllid populations with systemic insecticides (imidacloprid). Remove severely infected trees to prevent spread.",
        "prevention": "Use certified disease-free nursery stock. Monitor and control psyllid populations aggressively. Implement area-wide pest management programs."
    },
    "Peach___Bacterial_spot": {
        "cause": "Caused by the bacterium Xanthomonas arboricola pv. pruni. Spread by rain splash and favored by warm, wet weather.",
        "treatment": "Apply copper-based bactericide or oxytetracycline. Avoid overhead irrigation. Remove severely infected shoots.",
        "prevention": "Plant resistant varieties. Avoid low-lying, poorly drained sites. Apply preventive copper sprays before infection periods."
    },
    "Peach___healthy": {
        "cause": "No disease detected.",
        "treatment": "No treatment needed. Plant appears healthy. Continue regular care and monitoring.",
        "prevention": "Maintain proper pruning, balanced fertilization, and good drainage for continued plant health."
    },
    "Pepper,_bell___Bacterial_spot": {
        "cause": "Caused by Xanthomonas campestris pv. vesicatoria. Spread through infected seed, rain splash, and contaminated tools.",
        "treatment": "Apply copper-based bactericide mixed with mancozeb. Remove and destroy heavily infected plants. Avoid working with plants when wet.",
        "prevention": "Use certified disease-free seed. Practice 2-3 year crop rotation. Disinfect tools between plants."
    },
    "Pepper,_bell___healthy": {
        "cause": "No disease detected.",
        "treatment": "No treatment needed. Plant appears healthy. Continue regular care and monitoring.",
        "prevention": "Maintain proper watering, adequate spacing, and balanced nutrition for continued plant health."
    },
    "Potato___Early_blight": {
        "cause": "Caused by the fungus Alternaria solani. Favored by warm temperatures (24-29°C), high humidity, and stressed plants.",
        "treatment": "Apply chlorothalonil or mancozeb fungicide at first sign. Remove and destroy infected lower leaves. Maintain adequate plant nutrition.",
        "prevention": "Practice 3-year crop rotation. Avoid overhead irrigation. Ensure plants have adequate nitrogen and potassium nutrition."
    },
    "Potato___Late_blight": {
        "cause": "Caused by the oomycete Phytophthora infestans. Spreads rapidly in cool (10-20°C), wet conditions with high humidity.",
        "treatment": "Apply metalaxyl or chlorothalonil fungicide immediately. Remove and destroy all infected plant material. Harvest tubers in dry weather.",
        "prevention": "Plant certified disease-free seed potatoes. Destroy volunteer potatoes and cull piles. Apply preventive fungicides during wet weather."
    },
    "Potato___healthy": {
        "cause": "No disease detected.",
        "treatment": "No treatment needed. Plant appears healthy. Continue regular care and monitoring.",
        "prevention": "Use certified seed, practice crop rotation, and avoid excessive irrigation for continued plant health."
    },
    "Raspberry___healthy": {
        "cause": "No disease detected.",
        "treatment": "No treatment needed. Plant appears healthy. Continue regular care and monitoring.",
        "prevention": "Maintain proper pruning of spent canes, good air circulation, and adequate drainage for continued plant health."
    },
    "Soybean___healthy": {
        "cause": "No disease detected.",
        "treatment": "No treatment needed. Plant appears healthy. Continue regular care and monitoring.",
        "prevention": "Practice crop rotation, use certified seed, and maintain balanced soil fertility for continued plant health."
    },
    "Squash___Powdery_mildew": {
        "cause": "Caused by the fungus Podosphaera xanthii. Thrives in warm, dry weather with high humidity. Does NOT require leaf wetness.",
        "treatment": "Apply potassium bicarbonate, sulfur, or neem oil. Remove heavily infected leaves. Improve spacing and air circulation.",
        "prevention": "Plant mildew-resistant varieties. Avoid overcrowding. Apply preventive sprays when conditions are favorable (warm, dry days, cool nights)."
    },
    "Strawberry___Leaf_scorch": {
        "cause": "Caused by the fungus Diplocarpon earlianum. Spreads through rain splash and thrives in warm, wet conditions.",
        "treatment": "Apply captan or myclobutanil fungicide. Remove and destroy infected leaves. Renovate strawberry beds after harvest by mowing.",
        "prevention": "Plant resistant varieties. Maintain proper spacing for air circulation. Avoid overhead irrigation and work in dry conditions."
    },
    "Strawberry___healthy": {
        "cause": "No disease detected.",
        "treatment": "No treatment needed. Plant appears healthy. Continue regular care and monitoring.",
        "prevention": "Maintain proper spacing, mulching, and bed renovation for continued plant health."
    },
    "Tomato___Bacterial_spot": {
        "cause": "Caused by Xanthomonas bacteria. Spread through infected seed, rain splash, and contaminated tools. Favored by warm, wet conditions.",
        "treatment": "Apply copper-based bactericide combined with mancozeb. Remove and destroy heavily infected plants. Avoid overhead watering.",
        "prevention": "Use certified disease-free seed and transplants. Practice 2-3 year crop rotation. Disinfect tools and stakes between seasons."
    },
    "Tomato___Early_blight": {
        "cause": "Caused by the fungus Alternaria solani. Favored by warm temperatures, high humidity, and stressed or aging plants.",
        "treatment": "Apply chlorothalonil or copper-based fungicide. Remove infected lower leaves. Mulch around base to prevent soil splash.",
        "prevention": "Practice 3-year crop rotation. Stake and mulch plants. Ensure adequate nutrition (especially nitrogen and potassium)."
    },
    "Tomato___Late_blight": {
        "cause": "Caused by Phytophthora infestans (same pathogen as potato late blight). Spreads extremely fast in cool, wet weather.",
        "treatment": "Apply metalaxyl or chlorothalonil fungicide immediately. Remove and bag all infected plant parts. Destroy severely infected plants entirely.",
        "prevention": "Use resistant varieties. Avoid overhead irrigation. Monitor weather forecasts and apply preventive fungicides before rainy periods."
    },
    "Tomato___Leaf_Mold": {
        "cause": "Caused by the fungus Passalora fulva (Cladosporium fulvum). Thrives in high humidity (>85%) and temperatures of 22-24°C.",
        "treatment": "Improve ventilation in greenhouses. Apply chlorothalonil or copper fungicide. Remove and destroy infected leaves.",
        "prevention": "Maintain greenhouse humidity below 85%. Use resistant varieties. Ensure proper air circulation and avoid overcrowding."
    },
    "Tomato___Septoria_leaf_spot": {
        "cause": "Caused by the fungus Septoria lycopersici. Survives in crop debris and spreads through rain splash. Favored by warm, wet weather.",
        "treatment": "Apply chlorothalonil or copper-based fungicide. Remove and destroy infected lower leaves. Mulch to prevent soil splash.",
        "prevention": "Practice 3-year crop rotation. Remove infected debris at end of season. Use drip irrigation instead of overhead watering."
    },
    "Tomato___Spider_mites Two-spotted_spider_mite": {
        "cause": "Caused by the two-spotted spider mite (Tetranychus urticae). Thrives in hot, dry conditions. Populations explode during drought stress.",
        "treatment": "Apply insecticidal soap, neem oil, or miticide (abamectin). Spray the undersides of leaves thoroughly. Increase humidity around plants.",
        "prevention": "Maintain adequate watering to prevent plant stress. Introduce predatory mites (Phytoseiulus persimilis). Avoid broad-spectrum insecticides that kill natural predators."
    },
    "Tomato___Target_Spot": {
        "cause": "Caused by the fungus Corynespora cassiicola. Favored by warm temperatures and extended periods of leaf wetness.",
        "treatment": "Apply chlorothalonil or azoxystrobin fungicide. Remove and destroy infected leaves, especially lower foliage. Improve air circulation.",
        "prevention": "Practice crop rotation. Avoid overhead irrigation. Use staking or caging to keep foliage off the ground."
    },
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus": {
        "cause": "Caused by a begomovirus (TYLCV). Transmitted exclusively by the whitefly Bemisia tabaci. No plant-to-plant spread without whitefly.",
        "treatment": "No cure for infected plants. Remove and destroy infected plants immediately. Control whitefly populations with insecticides (imidacloprid) or sticky traps.",
        "prevention": "Use TYLCV-resistant tomato varieties. Control whiteflies with insect screens, reflective mulches, and biological control agents."
    },
    "Tomato___Tomato_mosaic_virus": {
        "cause": "Caused by Tomato mosaic virus (ToMV). Extremely stable virus transmitted mechanically through contaminated hands, tools, and seed.",
        "treatment": "No cure. Remove and destroy infected plants. Disinfect all tools with 10% bleach or milk solution. Wash hands before handling healthy plants.",
        "prevention": "Use resistant varieties (carrying Tm-2 gene). Use certified virus-free seed. Dip tools in milk or bleach between plants."
    },
    "Tomato___healthy": {
        "cause": "No disease detected.",
        "treatment": "No treatment needed. Plant appears healthy. Continue regular care and monitoring.",
        "prevention": "Maintain proper watering, balanced fertilization, crop rotation, and regular scouting for continued plant health."
    },
}

def get_disease_info(disease_name):
    info = DISEASE_INFO.get(disease_name, None)
    if info:
        return info
    return {
        "cause": "Consult agricultural extension service for more details.",
        "treatment": "Remove infected material and consult a specialist for targeted treatment recommendations.",
        "prevention": "Practice good crop hygiene, rotation, and use certified disease-free planting material."
    }


def _load_artifacts():
    global _model, _classes
    if not _ensure_tf():
        raise RuntimeError("TensorFlow not available. Install tensorflow first.")
    
    if _model is None:
        keras_path = os.path.join(MODEL_DIR, "disease_model_best.keras")
        h5_path    = os.path.join(MODEL_DIR, "disease_model_best.h5")
        final_path = os.path.join(MODEL_DIR, "disease_model.h5")
        
        if os.path.exists(keras_path):
            model_path = keras_path
        elif os.path.exists(h5_path):
            model_path = h5_path
        elif os.path.exists(final_path):
            model_path = final_path
        else:
            raise FileNotFoundError(
                f"No disease model found in {MODEL_DIR}. "
                "Expected: disease_model_best.keras, disease_model_best.h5, or disease_model.h5"
            )
        
        print(f"Loading disease model from: {model_path}")
        _model = _tf.keras.models.load_model(model_path)
        
        classes_path = os.path.join(MODEL_DIR, "disease_classes.json")
        with open(classes_path, "r") as f:
            _classes = json.load(f)
        print(f"Loaded {len(_classes)} disease classes.")


def preprocess_image(image_path_or_bytes):
    """Load and preprocess image for CNN prediction."""
    if isinstance(image_path_or_bytes, str):
        img = Image.open(image_path_or_bytes)
    else:
        img = Image.open(io.BytesIO(image_path_or_bytes))
    
   
    if img.mode != 'RGB':
        img = img.convert('RGB')
    
    
    img = img.resize(_image_size)
    img_array = np.array(img) / 255.0  
    img_array = np.expand_dims(img_array, axis=0) 
    
    return img_array


def predict_leaf(image_path_or_bytes):
    
    _load_artifacts()
    
    img = preprocess_image(image_path_or_bytes)
    
    predictions = _model.predict(img, verbose=0)
    pred_idx = np.argmax(predictions[0])
    confidence = float(predictions[0][pred_idx])
    
    disease_name = _classes[pred_idx]
    is_healthy = "healthy" in disease_name.lower()
    info = get_disease_info(disease_name)
    
    return {
        "disease": disease_name,
        "confidence": round(confidence, 4),
        "is_healthy": is_healthy,
        "cause": info["cause"],
        "treatment": info["treatment"],
        "prevention": info["prevention"],
        "all_probabilities": {
            cls: round(float(prob), 4) 
            for cls, prob in zip(_classes, predictions[0])
        }
    }


if __name__ == "__main__":
    try:
        import io
        print("Disease prediction module loaded successfully.")
        print(f"Model directory: {MODEL_DIR}")
        print(f"TensorFlow available: {TF_AVAILABLE}")
    except Exception as e:
        print(f"Note: {e}")
        print("Run train_disease_cnn.py first to train the model.")
