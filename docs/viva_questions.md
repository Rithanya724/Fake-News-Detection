# Capstone Viva Questions & Comprehensive Answers

This guide contains 32 in-depth questions and structured answers designed for undergraduate Computer Science and Data Analytics capstone project viva examinations.

---

## Part 1: Machine Learning & NLP (12 Questions)

### Q1: What is the primary objective of your capstone project?
**Answer**: The objective is to build an end-to-end web system that analyzes textile industry news, press releases, and rumors to classify whether an article is **REAL** or **POTENTIALLY MISLEADING** using Natural Language Processing and Machine Learning.

### Q2: Why did you choose Logistic Regression as the primary ML model?
**Answer**: Logistic Regression is computationally efficient and mathematically suited for high-dimensional, sparse feature spaces produced by TF-IDF vectorization. It applies L2 regularization to prevent overfitting and naturally outputs calibrated class probabilities via the sigmoid function, allowing us to display realistic "Model Confidence" and compute feature log-odds for explainability.

### Q3: What is TF-IDF and how does it work?
**Answer**: TF-IDF stands for *Term Frequency–Inverse Document Frequency*. It transforms text tokens into numerical weights by multiplying how frequently a word appears in a specific document (TF) by the inverse logarithm of the fraction of documents containing the word (IDF). This emphasizes domain-specific keywords (*e.g., "spindles", "sericulture"*) while penalizing common non-informative words.

### Q4: What is sublinear term-frequency scaling (`sublinear_tf=True`)?
**Answer**: Sublinear TF replaces raw term frequency $tf$ with $1 + \log(tf)$ for positive counts. This prevents an article that mentions a sensational word 20 times from having 20 times the mathematical weight of an article that mentions it once, dampening the effect of extreme repetition.

### Q5: What is Data Leakage, and how did you prevent it?
**Answer**: Data leakage occurs when information from the test dataset contaminates the training phase. We prevented this by strictly performing an 80/20 stratified train/test split **before** fitting the TF-IDF vectorizer. The vectorizer was fit solely on `X_train` and merely transformed `X_test`.

### Q6: What is the difference between Precision and Recall in fake news detection?
**Answer**:
- **Precision**: Out of all articles predicted as FAKE, what percentage were actually FAKE? (Measures false-alarm rate).
- **Recall**: Out of all actual FAKE articles in the dataset, what percentage did the model catch? (Measures coverage / missed fakes).

### Q7: What is an F1-Score?
**Answer**: F1-Score is the harmonic mean of Precision and Recall:
$$\text{F1} = 2 \times \frac{\text{Precision} \times \text{Recall}}{\text{Precision} + \text{Recall}}$$
It provides a balanced single metric when both false alarms and missed detections carry substantial consequences.

### Q8: What is a Confusion Matrix?
**Answer**: A 2x2 contingency table that maps actual ground truth classes against predicted classes:
- **True Negative (TN)**: Actual REAL predicted as REAL.
- **False Positive (FP)**: Actual REAL misclassified as FAKE (Type I Error).
- **False Negative (FN)**: Actual FAKE misclassified as REAL (Type II Error).
- **True Positive (TP)**: Actual FAKE caught as FAKE.

### Q9: Why did you compare Logistic Regression with Naive Bayes and Random Forest?
**Answer**: To evaluate how linear probabilistic boundaries (Logistic Regression) perform compared to independent conditional probability models (Multinomial Naive Bayes) and non-linear ensemble decision trees (Random Forest) on sparse textile text representations.

### Q10: How does the system generate feature-level explainability signals?
**Answer**: Because Logistic Regression is a linear model, the prediction log-odds is a linear combination of input features: $\sum (w_i \cdot x_i)$. By extracting the active TF-IDF weights ($x_i$) multiplied by the model's coefficients ($w_i$), we extract the top positive features (*Credible Indicators*) and top negative features (*Misleading Indicators*).

### Q11: What are stopwords, and why did you use a self-contained stopword set?
**Answer**: Stopwords are common functional words (e.g., *the, is, at, which*) that carry little semantic distinction. We used a self-contained 179-word standard NLP dictionary to guarantee deterministic, offline-safe execution without blocking on external socket downloads.

### Q12: Can your ML model mathematically prove that a real-world claim is true?
**Answer**: **No.** Machine learning models identify statistical text patterns and stylistic signals learned from training data. They cannot verify physical world ground truth without external cross-referencing against primary government gazettes or trade registries.

---

## Part 2: Backend & FastAPI (6 Questions)

### Q13: Why did you choose FastAPI over Flask or Django?
**Answer**: FastAPI is built on Starlette and Pydantic, offering native asynchronous request handling (ASGI), automatic OpenAPI/Swagger documentation generation (`/docs`), high throughput, and automatic request/response schema validation.

### Q14: What is REST API architecture?
**Answer**: Representational State Transfer (REST) is a stateless architectural style for web services that uses standard HTTP verbs (`GET`, `POST`, `PUT`, `DELETE`) with structured JSON payloads and standard HTTP status codes (`200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`).

### Q15: How does JWT authentication work in your application?
**Answer**: When a user logs in with valid credentials, the backend signs a JSON Web Token containing the user ID, email, and role (`admin`/`user`) using a secret key and HMAC-SHA256 algorithm (`HS256`). The client sends this token in the `Authorization: Bearer <token>` header for subsequent protected requests.

### Q16: How are passwords stored securely?
**Answer**: Passwords are never stored in plaintext. They are hashed using `bcrypt` with automatically generated random cryptographic salts.

### Q17: What is FastAPI Middleware?
**Answer**: Middleware is code that intercepts requests before they reach route handlers and responses before they leave the server. We used CORS middleware (`CORSMiddleware`) to allow secure cross-origin requests from the React frontend running on port 5173.

### Q18: How does the backend communicate with the trained ML model?
**Answer**: During startup, the FastAPI `PredictionService` loads the serialized `model.pkl` and `vectorizer.pkl` artifacts using `joblib`. When a `POST /api/v1/predict` request arrives, the text is preprocessed and vectorized in-memory for sub-millisecond inference.

---

## Part 3: Database & MongoDB (4 Questions)

### Q19: Why did you choose MongoDB for this system?
**Answer**: MongoDB is a document-oriented NoSQL database that stores data in flexible, JSON-like BSON documents. This structure is well-suited for unstructured news text, variable-length feature signal lists, and dynamic analytics timeline logs.

### Q20: What collections exist in your database schema?
**Answer**:
1. `users`: Account identities, email, bcrypt hash, role.
2. `predictions`: Prediction logs, confidence scores, textile category, feature signals.
3. `news`: Pre-curated textile industry articles.
4. `model_metrics`: Versioned training runs and benchmark matrices.

### Q21: What database indexes did you create and why?
**Answer**:
- Unique index on `users.email` to prevent duplicate account registration.
- Index on `predictions.user_id` and `predictions.created_at` to ensure fast paginated retrieval of user audit history.
- Index on `predictions.category` and `predictions.raw_label` for efficient analytics filtering.

### Q22: How does the system handle database outages or missing local MongoDB instances?
**Answer**: The database connection manager (`mongodb.py`) includes a resilient `InMemoryCollection` fallback store that emulates PyMongo query methods (`find`, `insert_one`, `delete_one`, `count_documents`, `sort`, `skip`, `limit`), ensuring zero crashes during live project evaluations.

---

## Part 4: Frontend & React (4 Questions)

### Q23: Why did you choose React with Vite?
**Answer**: React provides a component-driven architecture with a virtual DOM for efficient UI updates. Vite provides fast HMR (Hot Module Replacement) and optimized production Rollup bundling.

### Q24: What is React Context API and how did you use it?
**Answer**: React Context provides a way to pass data through the component tree without prop drilling. We created `AuthContext` to globally maintain authentication status, active user profile, and `login`/`logout` methods across all routes.

### Q25: How do Protected Routes and Role-Based Guards work in React?
**Answer**: We created `ProtectedRoute` and `AdminRoute` wrapper components. `ProtectedRoute` redirects unauthenticated visitors to `/login`, while `AdminRoute` verifies that `user.role === 'admin'`, displaying a 403 Forbidden screen if privileges are insufficient.

### Q26: What charting library did you use for analytics?
**Answer**: We used **Recharts** (a composable charting library built on React components) to render responsive Pie charts (Real vs Misleading split), Area charts (activity timelines), and Bar charts (confidence ranges & category distributions).

---

## Part 5: System Integration & Academic Questions (6 Questions)

### Q27: Explain the complete end-to-end lifecycle of a prediction request.
**Answer**:
1. The user pastes textile news into `DetectPage.jsx` and clicks "Analyze News".
2. React sends an authenticated `POST` request with JSON payload to FastAPI `/api/v1/predict`.
3. FastAPI validates input length via Pydantic (`PredictionRequest`).
4. `PredictionService` applies `preprocess_text()` (cleaning, tokenization, stopword removal).
5. The text is vectorized using the pre-fit `TfidfVectorizer`.
6. Logistic Regression predicts class probability and classifies as `REAL` or `POTENTIALLY MISLEADING`.
7. Feature signals ($w_i \cdot x_i$) and textile category are calculated.
8. The prediction is saved in MongoDB (`predictions` collection).
9. The response is returned to React and rendered with confidence badges, signal breakdown cards, and research notices.

### Q28: How does the system categorize textile sub-sectors?
**Answer**: The system uses domain keyword heuristics across 14 textile domains (Cotton, Silk, Wool, Yarn, Fabrics, Garments, Machinery, Subsidies, Policy, Prices, Sustainability, Labour, Technology, Exports).

### Q29: What are the main limitations of the current system?
**Answer**:
1. Dependent on the quality and distribution of training data.
2. Cannot perform real-time external fact-checking against live ministry gazettes.
3. Limited to English language textile reporting (does not yet process vernacular languages like Tamil or Hindi).

### Q30: What future enhancements would you propose?
**Answer**:
1. Deploying fine-tuned Transformer models (e.g., RoBERTa / DeBERTa).
2. Multilingual NLP support for major textile weaving hubs (Tamil, Hindi, Gujarati).
3. Automated web scrapers monitoring government trade portals (DGFT, Ministry of Textiles).
4. Browser extension for real-time news credibility assessment while browsing trade portals.

### Q31: How did you test the backend and ML pipeline?
**Answer**: We wrote automated tests using `pytest` and FastAPI's `TestClient` in `backend/tests/test_api.py`, testing health endpoints, user registration, token issuance, prediction inference, input validation, and role authorization.

### Q32: What terminology does the user interface strictly enforce and why?
**Answer**: To maintain academic rigor, the UI uses **"Model Prediction"**, **"Model Confidence"**, and **"POTENTIALLY MISLEADING"** rather than claiming "100% Truth" or "Absolute Fact", correctly framing the output as an empirical ML estimation.
