"""
Evaluation Script for Textile Fake News Detection System.
"""

import os
import sys

# Ensure current directory is in sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import json
import joblib
import pandas as pd
import numpy as np
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    classification_report
)

from preprocessing import preprocess_text

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(BASE_DIR, "dataset", "textile_news.csv")
MODELS_DIR = os.path.join(BASE_DIR, "models")
MODEL_PATH = os.path.join(MODELS_DIR, "model.pkl")
VECTORIZER_PATH = os.path.join(MODELS_DIR, "vectorizer.pkl")
METADATA_PATH = os.path.join(MODELS_DIR, "metadata.json")

def evaluate_saved_model():
    if not os.path.exists(MODEL_PATH) or not os.path.exists(VECTORIZER_PATH):
        print("[!] Model or vectorizer not found. Please run 'python ml/train.py' first.", flush=True)
        return
    
    print(f"[*] Loading model from: {MODEL_PATH}", flush=True)
    model = joblib.load(MODEL_PATH)
    
    print(f"[*] Loading vectorizer from: {VECTORIZER_PATH}", flush=True)
    vectorizer = joblib.load(VECTORIZER_PATH)
    
    if os.path.exists(METADATA_PATH):
        with open(METADATA_PATH, "r", encoding="utf-8") as f:
            metadata = json.load(f)
        print(f"[*] Loaded metadata for: {metadata.get('model_name')} (trained {metadata.get('trained_date')})", flush=True)
    
    print(f"[*] Loading evaluation dataset from: {DATASET_PATH}", flush=True)
    df = pd.read_csv(DATASET_PATH)
    df["full_text"] = df["title"].fillna("") + " " + df["text"].fillna("")
    df["cleaned_text"] = df["full_text"].apply(preprocess_text)
    
    X = df["cleaned_text"].values
    y_true = df["label"].values
    
    X_tfidf = vectorizer.transform(X)
    y_pred = model.predict(X_tfidf)
    
    acc = accuracy_score(y_true, y_pred)
    prec = precision_score(y_true, y_pred, pos_label="FAKE", zero_division=0)
    rec = recall_score(y_true, y_pred, pos_label="FAKE", zero_division=0)
    f1 = f1_score(y_true, y_pred, pos_label="FAKE", zero_division=0)
    cm = confusion_matrix(y_true, y_pred, labels=["REAL", "FAKE"])
    
    print("\n" + "=" * 60, flush=True)
    print("           FULL DATASET EVALUATION REPORT           ", flush=True)
    print("=" * 60, flush=True)
    print(f"Total Samples Evaluated: {len(df)}", flush=True)
    print(f"Overall Accuracy:        {acc * 100:.2f}%", flush=True)
    print(f"Precision (Fake class):  {prec * 100:.2f}%", flush=True)
    print(f"Recall (Fake class):     {rec * 100:.2f}%", flush=True)
    print(f"F1-Score (Fake class):   {f1 * 100:.2f}%", flush=True)
    print("-" * 60, flush=True)
    print("Confusion Matrix [[TN, FP], [FN, TP]]:", flush=True)
    print(cm, flush=True)
    print("-" * 60, flush=True)
    print("\nDetailed Classification Breakdown:", flush=True)
    print(classification_report(y_true, y_pred), flush=True)
    print("=" * 60, flush=True)

if __name__ == "__main__":
    evaluate_saved_model()
