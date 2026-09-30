# Machine Learning & NLP Pipeline Documentation

## 1. Pipeline Overview
The Natural Language Processing (NLP) and Machine Learning (ML) architecture converts raw textile news articles into vectorized numerical representations, makes probabilistic classifications, and extracts log-odds feature signals.

```text
Raw Text Input
      │
      ▼  clean_text()
HTML Entity Unescaping & Tag Stripping (<.*?>)
      │
      ▼  remove_urls()
URL Regular Expression Filtering (https?://\S+|www\.\S+)
      │
      ▼  remove_special_characters()
Unicode Normalization (NFKD) & Punctuation Stripping ([^a-zA-Z0-9\s])
      │
      ▼  tokenize_text() & remove_stopwords()
Tokenization & Stopwords Filtering (179 Standard English Stopwords)
      │
      ▼
Normalized Clean Text Token Sequence
      │
      ▼  TfidfVectorizer.transform()
TF-IDF Sparse Vector Representation (Unigrams + Bigrams, Sublinear TF)
      │
      ▼  LogisticRegression.predict_proba()
Sigmoid Probability Log-Odds Estimation
      │
      ▼
Prediction Output + Confidence Score + Explainability Signals
```

---

## 2. Anti-Data Leakage Protocol
To prevent data contamination, the data processing workflow enforces strict separation:
1. The dataset is split into **80% Training Split** and **20% Test Split** with stratification on class labels (`REAL` vs `FAKE`).
2. The `TfidfVectorizer` is fit **only** on `X_train`.
3. `X_test` and future REST API inference queries are transformed using the pre-fit vectorizer without calling `fit()`.

---

## 3. Mathematical Foundations

### A. TF-IDF (Term Frequency - Inverse Document Frequency)
$$\text{TF-IDF}(t, d, D) = \text{TF}(t, d) \times \text{IDF}(t, D)$$
Where:
- $\text{TF}(t, d) = 1 + \log(\text{term count})$ (sublinear scaling).
- $\text{IDF}(t, D) = \log\left(\frac{1 + |D|}{1 + \text{DF}(t)}\right) + 1$.

### B. Logistic Regression Log-Odds & Sigmoid Probability
The model calculates the probability $P(Y = \text{REAL} \mid \mathbf{x})$:
$$P(Y = \text{REAL} \mid \mathbf{x}) = \sigma(\mathbf{w}^T \mathbf{x} + b) = \frac{1}{1 + e^{-(\mathbf{w}^T \mathbf{x} + b)}}$$

### C. Feature Explainability Extraction
For each active token $i$ present in the input text vector $\mathbf{x}$:
$$\text{Contribution}_i = x_i \cdot w_i$$
- If $\text{Contribution}_i > 0$: The term increases $P(\text{REAL})$ $\rightarrow$ **Credible Indicator**.
- If $\text{Contribution}_i < 0$: The term increases $P(\text{FAKE})$ $\rightarrow$ **Misleading Indicator**.

---

## 4. Empirical Model Benchmarks

| Model | Accuracy | Precision (Fake) | Recall (Fake) | F1-Score |
|---|---|---|---|---|
| **Logistic Regression (Primary)** | **100.00%** | **100.00%** | **100.00%** | **100.00%** |
| Multinomial Naive Bayes | 100.00% | 100.00% | 100.00% | 100.00% |
| Random Forest Classifier | 94.64% | 100.00% | 88.46% | 93.88% |
