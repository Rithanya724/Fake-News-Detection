"""
Interactive & Automated Prediction Testing Script for Textile Fake News Detection.
"""

import os
import sys

# Ensure current directory is in sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import json
import joblib
import numpy as np

from preprocessing import preprocess_text

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "models", "model.pkl")
VECTORIZER_PATH = os.path.join(BASE_DIR, "models", "vectorizer.pkl")

def explain_prediction(text: str, model, vectorizer, top_k=5):
    """
    Extract top TF-IDF features contributing towards REAL or FAKE classifications.
    In binary Logistic Regression with classes ['FAKE', 'REAL']:
    - Positive weight (> 0) pushes prediction towards REAL (Credible Indicator).
    - Negative weight (< 0) pushes prediction towards FAKE (Misleading Indicator).
    """
    cleaned = preprocess_text(text)
    if not cleaned.strip():
        return "REAL", 0.50, []
    
    tfidf_vec = vectorizer.transform([cleaned])
    probs = model.predict_proba(tfidf_vec)[0]
    classes = list(model.classes_)
    
    fake_idx = classes.index("FAKE")
    fake_prob = probs[fake_idx]
    
    prediction = "FAKE" if fake_prob >= 0.5 else "REAL"
    confidence = fake_prob if prediction == "FAKE" else (1.0 - fake_prob)
    
    feature_names = np.array(vectorizer.get_feature_names_out())
    nz_indices = tfidf_vec.nonzero()[1]
    
    signals = []
    if len(nz_indices) > 0:
        # coef_[0] corresponds to log-odds of classes_[1] (REAL)
        coefs = model.coef_[0]
        real_idx = classes.index("REAL")
        
        contributions = []
        for idx in nz_indices:
            feat_name = feature_names[idx]
            weight = tfidf_vec[0, idx] * coefs[idx]
            contributions.append((feat_name, weight))
        
        # Sort by absolute weight magnitude
        contributions.sort(key=lambda x: abs(x[1]), reverse=True)
        for feat, weight in contributions[:top_k]:
            signal_direction = "Credible Indicator" if weight > 0 else "Misleading Indicator"
            signals.append({
                "feature": feat,
                "weight": round(float(weight), 4),
                "indicator": signal_direction
            })
            
    return prediction, float(confidence), signals

def test_samples():
    if not os.path.exists(MODEL_PATH) or not os.path.exists(VECTORIZER_PATH):
        print("[!] Model artifacts missing. Run 'python ml/train.py' first.", flush=True)
        return
        
    model = joblib.load(MODEL_PATH)
    vectorizer = joblib.load(VECTORIZER_PATH)
    
    test_cases = [
        {
            "description": "Sample 1: Real Industry Report on Cotton MSP & Exports",
            "text": "The Cotton Corporation of India has announced the Minimum Support Price procurement schedule across Gujarat and Maharashtra to support domestic farmers and stabilize cotton yarn supply."
        },
        {
            "description": "Sample 2: Fake Sensational Rumor on Alien Seeds & Bans",
            "text": "URGENT BREAKING: Government issues secret decree banning 100% of cotton exports overnight! Click this link for instant 50 lakh cash subsidy transfer directly to bank account without inspection!"
        },
        {
            "description": "Sample 3: Real Technical Article on Silk Sericulture",
            "text": "Central Silk Board reported a steady increase in mulberry cocoon yields following the distribution of improved bi-voltine silkworm varieties to handloom cooperatives in Karnataka."
        },
        {
            "description": "Sample 4: Fake Toxic Polyester Fabric Panic",
            "text": "SHOCKING ALERT: All polyester garments are exploding under sunlight due to toxic chemical radiation! World Health Organization bans all synthetic clothes worldwide immediately!"
        }
    ]
    
    print("=" * 75, flush=True)
    print("        INFERENCE & EXPLAINABILITY SYSTEM VERIFICATION        ", flush=True)
    print("=" * 75, flush=True)
    
    for case in test_cases:
        print(f"\n[Case] {case['description']}", flush=True)
        print(f"Input Text: \"{case['text']}\"", flush=True)
        
        pred, conf, signals = explain_prediction(case["text"], model, vectorizer)
        label_display = "POTENTIALLY MISLEADING" if pred == "FAKE" else "REAL"
        
        print(f"Prediction:         {label_display}", flush=True)
        print(f"Model Confidence:   {conf * 100:.2f}%", flush=True)
        print("Important Signals:", flush=True)
        for s in signals:
            print(f"  - Term: '{s['feature']}' ({s['indicator']}, weight: {s['weight']})", flush=True)
        print("-" * 75, flush=True)

if __name__ == "__main__":
    test_samples()
