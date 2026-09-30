"""
Model Training Script for Textile Fake News Detection System.
"""

import os
import sys

# Ensure current directory is in sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import json
import datetime
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    classification_report
)

from preprocessing import preprocess_text

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(BASE_DIR, "dataset", "textile_news.csv")
MODELS_DIR = os.path.join(BASE_DIR, "models")
MODEL_PATH = os.path.join(MODELS_DIR, "model.pkl")
VECTORIZER_PATH = os.path.join(MODELS_DIR, "vectorizer.pkl")
METADATA_PATH = os.path.join(MODELS_DIR, "metadata.json")

def load_and_prepare_data(csv_path: str):
    print(f"[*] Loading dataset from: {csv_path}", flush=True)
    df = pd.read_csv(csv_path)
    
    # Validate required columns
    required_cols = {"id", "title", "text", "label"}
    if not required_cols.issubset(df.columns):
        raise ValueError(f"Dataset missing required columns: {required_cols - set(df.columns)}")
    
    # Combine title and text for rich context representation
    df["full_text"] = df["title"].fillna("") + " " + df["text"].fillna("")
    
    print("[*] Running NLP preprocessing across raw text...", flush=True)
    df["cleaned_text"] = df["full_text"].apply(preprocess_text)
    
    X = df["cleaned_text"].values
    y = df["label"].values
    
    print(f"[*] Total dataset records: {len(df)}", flush=True)
    print(f"[*] Class distribution:\n{df['label'].value_counts()}", flush=True)
    return X, y, df

def train_primary_model():
    os.makedirs(MODELS_DIR, exist_ok=True)
    
    X, y, df = load_and_prepare_data(DATASET_PATH)
    
    # Step 1: Anti-Leakage Train/Test Split (80% Train, 20% Test)
    print("\n[*] Splitting dataset (80% Train / 20% Test, Stratified, Random State=42)...", flush=True)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )
    print(f"[*] Training samples: {len(X_train)} | Testing samples: {len(X_test)}", flush=True)
    
    # Step 2: Fit TF-IDF Vectorizer ONLY on training data
    print("\n[*] Fitting TF-IDF Vectorizer on training data...", flush=True)
    vectorizer = TfidfVectorizer(
        max_features=3000,
        ngram_range=(1, 2),
        min_df=2,
        sublinear_tf=True
    )
    X_train_tfidf = vectorizer.fit_transform(X_train)
    X_test_tfidf = vectorizer.transform(X_test)
    print(f"[*] TF-IDF Vocabulary Size: {len(vectorizer.vocabulary_)} features", flush=True)
    
    # Step 3: Train Primary Model - Logistic Regression
    print("\n[*] Training Primary Model: Logistic Regression (C=1.0, max_iter=1000)...", flush=True)
    model = LogisticRegression(C=1.0, max_iter=1000, random_state=42)
    model.fit(X_train_tfidf, y_train)
    
    # Step 4: Evaluate on Unseen Test Split
    print("\n[*] Evaluating model on test split...", flush=True)
    y_pred = model.predict(X_test_tfidf)
    
    acc = float(accuracy_score(y_test, y_pred))
    prec = float(precision_score(y_test, y_pred, pos_label="FAKE", zero_division=0))
    rec = float(recall_score(y_test, y_pred, pos_label="FAKE", zero_division=0))
    f1 = float(f1_score(y_test, y_pred, pos_label="FAKE", zero_division=0))
    cm = confusion_matrix(y_test, y_pred, labels=["REAL", "FAKE"]).tolist()
    
    print("=" * 55, flush=True)
    print("           PRIMARY MODEL EVALUATION RESULTS           ", flush=True)
    print("=" * 55, flush=True)
    print(f"Model:                 Logistic Regression", flush=True)
    print(f"Accuracy:              {acc * 100:.2f}%", flush=True)
    print(f"Precision (FAKE):      {prec * 100:.2f}%", flush=True)
    print(f"Recall (FAKE):         {rec * 100:.2f}%", flush=True)
    print(f"F1-Score (FAKE):       {f1 * 100:.2f}%", flush=True)
    print("-" * 55, flush=True)
    print("Confusion Matrix [[TN, FP], [FN, TP]]:", flush=True)
    print(f"  REAL (True REAL): {cm[0][0]} correctly classified, {cm[0][1]} false alarms", flush=True)
    print(f"  FAKE (True FAKE): {cm[1][1]} correctly detected, {cm[1][0]} missed", flush=True)
    print("-" * 55, flush=True)
    print("\nClassification Report:\n", classification_report(y_test, y_pred), flush=True)
    print("=" * 55, flush=True)
    
    # Step 5: Save Model & Vectorizer Artifacts
    print(f"[*] Saving model to: {MODEL_PATH}", flush=True)
    joblib.dump(model, MODEL_PATH)
    
    print(f"[*] Saving vectorizer to: {VECTORIZER_PATH}", flush=True)
    joblib.dump(vectorizer, VECTORIZER_PATH)
    
    # Step 6: Save Metadata
    metadata = {
        "model_name": "Logistic Regression",
        "model_version": "1.0.0",
        "trained_date": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "dataset_name": "textile_news.csv",
        "dataset_total_records": len(df),
        "train_samples": len(X_train),
        "test_samples": len(X_test),
        "vectorizer": {
            "type": "TfidfVectorizer",
            "max_features": 3000,
            "ngram_range": [1, 2],
            "sublinear_tf": True,
            "vocab_size": len(vectorizer.vocabulary_)
        },
        "metrics": {
            "accuracy": round(acc, 4),
            "precision": round(prec, 4),
            "recall": round(rec, 4),
            "f1_score": round(f1, 4),
            "confusion_matrix": cm,
            "labels": ["REAL", "FAKE"]
        }
    }
    
    with open(METADATA_PATH, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)
    print(f"[*] Saved metadata to: {METADATA_PATH}", flush=True)
    
    return model, vectorizer, metadata

if __name__ == "__main__":
    train_primary_model()
