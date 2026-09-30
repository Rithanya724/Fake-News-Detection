"""
Model Comparison & Benchmarking Script for Textile Fake News Detection System.

Models Benchmarked:
1. Logistic Regression (Linear Classifier with Probabilistic Sigmoid Output)
2. Multinomial Naive Bayes (Probabilistic Classifier suited for Word Frequency counts)
3. Random Forest Classifier (Non-linear Ensemble of Decision Trees)
"""

import os
import sys

# Ensure current directory is in sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import json
import datetime
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import MultinomialNB
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix
)

from preprocessing import preprocess_text

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(BASE_DIR, "dataset", "textile_news.csv")
MODELS_DIR = os.path.join(BASE_DIR, "models")
COMPARISON_METRICS_PATH = os.path.join(MODELS_DIR, "comparison_metrics.json")

def run_model_benchmarks():
    os.makedirs(MODELS_DIR, exist_ok=True)
    
    print("[*] Loading and preprocessing dataset...", flush=True)
    df = pd.read_csv(DATASET_PATH)
    df["full_text"] = df["title"].fillna("") + " " + df["text"].fillna("")
    df["cleaned_text"] = df["full_text"].apply(preprocess_text)
    
    X = df["cleaned_text"].values
    y = df["label"].values
    
    # Stratified Split (80% Train, 20% Test)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )
    
    # TF-IDF Vectorization fit ONLY on train split
    vectorizer = TfidfVectorizer(
        max_features=3000,
        ngram_range=(1, 2),
        min_df=2,
        sublinear_tf=True
    )
    X_train_tfidf = vectorizer.fit_transform(X_train)
    X_test_tfidf = vectorizer.transform(X_test)
    
    # Define candidate models
    models = {
        "Logistic Regression": LogisticRegression(C=1.0, max_iter=1000, random_state=42),
        "Multinomial Naive Bayes": MultinomialNB(alpha=0.1),
        "Random Forest": RandomForestClassifier(n_estimators=100, max_depth=20, random_state=42)
    }
    
    results = []
    
    print("\n" + "=" * 80, flush=True)
    print(f"{'Model':<26} | {'Accuracy':<10} | {'Precision':<10} | {'Recall':<10} | {'F1-Score':<10}", flush=True)
    print("=" * 80, flush=True)
    
    for name, clf in models.items():
        # Train model
        clf.fit(X_train_tfidf, y_train)
        
        # Predict on test split
        y_pred = clf.predict(X_test_tfidf)
        
        # Calculate evaluation metrics for FAKE class
        acc = float(accuracy_score(y_test, y_pred))
        prec = float(precision_score(y_test, y_pred, pos_label="FAKE", zero_division=0))
        rec = float(recall_score(y_test, y_pred, pos_label="FAKE", zero_division=0))
        f1 = float(f1_score(y_test, y_pred, pos_label="FAKE", zero_division=0))
        cm = confusion_matrix(y_test, y_pred, labels=["REAL", "FAKE"]).tolist()
        
        print(f"{name:<26} | {acc * 100:>8.2f}% | {prec * 100:>8.2f}% | {rec * 100:>8.2f}% | {f1 * 100:>8.2f}%", flush=True)
        
        results.append({
            "model_name": name,
            "accuracy": round(acc, 4),
            "precision": round(prec, 4),
            "recall": round(rec, 4),
            "f1_score": round(f1, 4),
            "confusion_matrix": cm
        })
    
    print("=" * 80, flush=True)
    
    print(f"\n[+] Selected Primary Production Model: Logistic Regression", flush=True)
    
    output_data = {
        "benchmark_timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "dataset_total_samples": len(df),
        "test_samples": len(X_test),
        "primary_model": "Logistic Regression",
        "models": results
    }
    
    with open(COMPARISON_METRICS_PATH, "w", encoding="utf-8") as f:
        json.dump(output_data, f, indent=2)
    print(f"[+] Benchmarking results exported to: {COMPARISON_METRICS_PATH}", flush=True)

if __name__ == "__main__":
    run_model_benchmarks()
