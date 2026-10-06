"""
MongoDB Database Connection & Collection Manager.

Provides robust connection management with collections:
- users
- predictions
- news
- model_metrics

Includes an in-memory fallback store to ensure seamless local capstone demo execution if MongoDB server is offline.
"""

import datetime
import uuid
from typing import Dict, Any, List, Optional
from pymongo import MongoClient, ASCENDING, DESCENDING
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError

from app.config.settings import settings
from app.utils.security import hash_password

class InMemoryCollection:
    """Mock MongoDB collection for resilient fallback execution."""
    def __init__(self, name: str):
        self.name = name
        self.documents: List[Dict[str, Any]] = []

    def insert_one(self, doc: Dict[str, Any]):
        doc_copy = doc.copy()
        if "_id" not in doc_copy:
            doc_copy["_id"] = str(uuid.uuid4())
        self.documents.append(doc_copy)
        class InsertResult:
            def __init__(self, inserted_id):
                self.inserted_id = inserted_id
        return InsertResult(doc_copy["_id"])

    def find_one(self, query: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        for doc in self.documents:
            match = True
            for k, v in query.items():
                if k == "$or":
                    or_matched = False
                    for sub_q in v:
                        sub_match = True
                        for sk, sv in sub_q.items():
                            if doc.get(sk) != sv:
                                sub_match = False
                                break
                        if sub_match:
                            or_matched = True
                            break
                    if not or_matched:
                        match = False
                        break
                elif doc.get(k) != v:
                    match = False
                    break
            if match:
                return doc.copy()
        return None

    def find(self, query: Optional[Dict[str, Any]] = None):
        query = query or {}
        matched = []
        for doc in self.documents:
            match = True
            for k, v in query.items():
                if k == "$or":
                    or_matched = False
                    for sub_q in v:
                        sub_match = True
                        for sk, sv in sub_q.items():
                            if isinstance(sv, dict) and "$regex" in sv:
                                pattern = sv["$regex"]
                                flags = sv.get("$options", "")
                                import re
                                r_flags = re.IGNORECASE if "i" in flags else 0
                                if not re.search(pattern, str(doc.get(sk, "")), r_flags):
                                    sub_match = False
                                    break
                            elif doc.get(sk) != sv:
                                sub_match = False
                                break
                        if sub_match:
                            or_matched = True
                            break
                    if not or_matched:
                        match = False
                        break
                elif isinstance(v, dict) and "$regex" in v:
                    import re
                    pattern = v["$regex"]
                    flags = v.get("$options", "")
                    r_flags = re.IGNORECASE if "i" in flags else 0
                    if not re.search(pattern, str(doc.get(k, "")), r_flags):
                        match = False
                        break
                elif doc.get(k) != v:
                    match = False
                    break
            if match:
                matched.append(doc.copy())
                
        class Cursor:
            def __init__(self, docs):
                self.docs = docs
            def sort(self, key_or_list, direction=None):
                if isinstance(key_or_list, list):
                    k, d = key_or_list[0]
                else:
                    k, d = key_or_list, direction or -1
                rev = (d == -1 or d == DESCENDING)
                self.docs.sort(key=lambda x: str(x.get(k, "")), reverse=rev)
                return self
            def skip(self, n: int):
                self.docs = self.docs[n:]
                return self
            def limit(self, n: int):
                self.docs = self.docs[:n]
                return self
            def __iter__(self):
                return iter(self.docs)
            def to_list(self):
                return list(self.docs)
                
        return Cursor(matched)

    def count_documents(self, query: Optional[Dict[str, Any]] = None) -> int:
        return len(self.find(query).to_list())

    def delete_one(self, query: Dict[str, Any]):
        for i, doc in enumerate(self.documents):
            match = True
            for k, v in query.items():
                if k == "$or":
                    or_matched = False
                    for sub_q in v:
                        sub_match = True
                        for sk, sv in sub_q.items():
                            if doc.get(sk) != sv:
                                sub_match = False
                                break
                        if sub_match:
                            or_matched = True
                            break
                    if not or_matched:
                        match = False
                        break
                elif doc.get(k) != v:
                    match = False
                    break
            if match:
                del self.documents[i]
                class DeleteResult:
                    deleted_count = 1
                return DeleteResult()
        class DeleteResultEmpty:
            deleted_count = 0
        return DeleteResultEmpty()

    def create_index(self, *args, **kwargs):
        pass


class Database:
    def __init__(self):
        self.client = None
        self.db = None
        self.is_connected = False
        self.users = None
        self.predictions = None
        self.news = None
        self.model_metrics = None

    def connect(self):
        if self.users is not None:
            return
            
        try:
            print(f"[*] Attempting MongoDB connection to: {settings.MONGODB_URI}...")
            self.client = MongoClient(settings.MONGODB_URI, serverSelectionTimeoutMS=2000)
            self.client.server_info()
            self.db = self.client[settings.DATABASE_NAME]
            self.users = self.db["users"]
            self.predictions = self.db["predictions"]
            self.news = self.db["news"]
            self.model_metrics = self.db["model_metrics"]
            
            self.users.create_index([("email", ASCENDING)], unique=True)
            self.predictions.create_index([("user_id", ASCENDING)])
            self.predictions.create_index([("created_at", DESCENDING)])
            self.predictions.create_index([("category", ASCENDING)])
            self.predictions.create_index([("raw_label", ASCENDING)])
            
            self.is_connected = True
            print("[+] Connected to Live MongoDB Database successfully.")
        except Exception as e:
            print(f"[!] MongoDB service unavailable ({e}). Initializing In-Memory Datastore fallback.")
            self.is_connected = False
            self.users = InMemoryCollection("users")
            self.predictions = InMemoryCollection("predictions")
            self.news = InMemoryCollection("news")
            self.model_metrics = InMemoryCollection("model_metrics")

        self._seed_default_data()

    def _seed_default_data(self):
        # 1. Seed Admin User
        admin_email = "admin@textile.org"
        if not self.users.find_one({"email": admin_email}):
            self.users.insert_one({
                "_id": str(uuid.uuid4()),
                "name": "System Administrator",
                "email": admin_email,
                "password_hash": hash_password("Admin@123"),
                "role": "admin",
                "created_at": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            })
            print("[+] Seeded Admin User: admin@textile.org / Admin@123")

        # 2. Seed Student/Regular User
        user_email = "user@textile.org"
        if not self.users.find_one({"email": user_email}):
            user_id = str(uuid.uuid4())
            self.users.insert_one({
                "_id": user_id,
                "name": "Textile Analyst",
                "email": user_email,
                "password_hash": hash_password("User@123"),
                "role": "user",
                "created_at": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            })
            print("[+] Seeded Demo User: user@textile.org / User@123")
            
            sample_predictions = [
                {
                    "user_id": user_id,
                    "title": "Cotton MSP Procurement Initiated",
                    "text": "The Cotton Corporation of India has started Minimum Support Price procurement centers across Gujarat and Maharashtra to safeguard farmer interests.",
                    "prediction": "REAL",
                    "raw_label": "REAL",
                    "confidence": 0.942,
                    "confidence_percentage": 94.2,
                    "model": "Logistic Regression",
                    "category": "Cotton",
                    "important_signals": [
                        {"feature": "cotton", "weight": 0.1367, "indicator": "Credible Indicator"},
                        {"feature": "support", "weight": 0.0886, "indicator": "Credible Indicator"}
                    ],
                    "created_at": "2026-02-15 10:30:00"
                },
                {
                    "user_id": user_id,
                    "title": "Secret Midnight Cotton Export Ban Hoax",
                    "text": "Government bans 100% of cotton exports overnight! Click this link for instant 50 lakh cash subsidy transfer directly to bank account!",
                    "prediction": "POTENTIALLY MISLEADING",
                    "raw_label": "FAKE",
                    "confidence": 0.915,
                    "confidence_percentage": 91.5,
                    "model": "Logistic Regression",
                    "category": "Cotton",
                    "important_signals": [
                        {"feature": "secret", "weight": -0.1189, "indicator": "Misleading Indicator"},
                        {"feature": "urgent", "weight": -0.0878, "indicator": "Misleading Indicator"}
                    ],
                    "created_at": "2026-02-18 14:15:00"
                },
                {
                    "user_id": user_id,
                    "title": "Silk Board Announces Cocoon Growth",
                    "text": "The Central Silk Board reported an 8 percent increase in mulberry raw silk production in Karnataka and Tamil Nadu with modernized rearing.",
                    "prediction": "REAL",
                    "raw_label": "REAL",
                    "confidence": 0.887,
                    "confidence_percentage": 88.7,
                    "model": "Logistic Regression",
                    "category": "Silk",
                    "important_signals": [
                        {"feature": "reported", "weight": 0.1774, "indicator": "Credible Indicator"},
                        {"feature": "steady", "weight": 0.1534, "indicator": "Credible Indicator"}
                    ],
                    "created_at": "2026-02-20 11:45:00"
                },
                {
                    "user_id": user_id,
                    "title": "National Technical Textiles Mission R&D Grants Cleared",
                    "text": "The Ministry of Textiles approved Rs 300 crore R&D grants under NTTM for geotextiles, medical dressings, and protective flame-retardant suits.",
                    "prediction": "REAL",
                    "raw_label": "REAL",
                    "confidence": 0.924,
                    "confidence_percentage": 92.4,
                    "model": "Logistic Regression",
                    "category": "Technical Textiles",
                    "important_signals": [
                        {"feature": "mission", "weight": 0.1621, "indicator": "Credible Indicator"},
                        {"feature": "approved", "weight": 0.1415, "indicator": "Credible Indicator"}
                    ],
                    "created_at": "2026-02-22 09:15:00"
                },
                {
                    "user_id": user_id,
                    "title": "Exploding Polyester Fabrics Worldwide Ban Hoax",
                    "text": "SHOCKING ALERT: WHO bans all polyester synthetic fabrics globally! Clothes burst into flames under direct sunlight. Burn all polyester immediately!",
                    "prediction": "POTENTIALLY MISLEADING",
                    "raw_label": "FAKE",
                    "confidence": 0.958,
                    "confidence_percentage": 95.8,
                    "model": "Logistic Regression",
                    "category": "Synthetic",
                    "important_signals": [
                        {"feature": "shocking", "weight": -0.1452, "indicator": "Misleading Indicator"},
                        {"feature": "burst", "weight": -0.1204, "indicator": "Misleading Indicator"}
                    ],
                    "created_at": "2026-02-24 16:20:00"
                },
                {
                    "user_id": user_id,
                    "title": "Cabinet Clears Mandatory Jute Packaging Norms",
                    "text": "Cabinet Committee on Economic Affairs approved mandatory reservation of 100% foodgrains and 20% refined sugar in eco-friendly jute sacking bags.",
                    "prediction": "REAL",
                    "raw_label": "REAL",
                    "confidence": 0.910,
                    "confidence_percentage": 91.0,
                    "model": "Logistic Regression",
                    "category": "Jute",
                    "important_signals": [
                        {"feature": "cabinet", "weight": 0.1583, "indicator": "Credible Indicator"},
                        {"feature": "approved", "weight": 0.1415, "indicator": "Credible Indicator"}
                    ],
                    "created_at": "2026-02-27 13:10:00"
                },
                {
                    "user_id": user_id,
                    "title": "Instant 50 Lakh Powerloom Cash Grant Viral Rumor",
                    "text": "Government announces 50 lakh rupees instant grant deposited to powerloom bank accounts tomorrow without any audits or GST tax returns!",
                    "prediction": "POTENTIALLY MISLEADING",
                    "raw_label": "FAKE",
                    "confidence": 0.892,
                    "confidence_percentage": 89.2,
                    "model": "Logistic Regression",
                    "category": "Policy",
                    "important_signals": [
                        {"feature": "instant", "weight": -0.1341, "indicator": "Misleading Indicator"},
                        {"feature": "claim", "weight": -0.0984, "indicator": "Misleading Indicator"}
                    ],
                    "created_at": "2026-03-01 18:40:00"
                },
                {
                    "user_id": user_id,
                    "title": "Tirupur Knitwear Cluster Marks 14% Export Rebound",
                    "text": "Apparel exporters in Tirupur reported a 14% year-on-year shipment surge to European markets following zero-liquid-discharge green compliance audits.",
                    "prediction": "REAL",
                    "raw_label": "REAL",
                    "confidence": 0.875,
                    "confidence_percentage": 87.5,
                    "model": "Logistic Regression",
                    "category": "Garments",
                    "important_signals": [
                        {"feature": "export", "weight": 0.1250, "indicator": "Credible Indicator"},
                        {"feature": "compliance", "weight": 0.1102, "indicator": "Credible Indicator"}
                    ],
                    "created_at": "2026-03-03 11:20:00"
                },
                {
                    "user_id": user_id,
                    "title": "Mandatory QCO Norms Enforced for Viscose Staple Fibre",
                    "text": "Bureau of Indian Standards and Ministry of Textiles enforce Quality Control Orders for viscose staple fibres to ensure uniform tensile grade.",
                    "prediction": "REAL",
                    "raw_label": "REAL",
                    "confidence": 0.931,
                    "confidence_percentage": 93.1,
                    "model": "Logistic Regression",
                    "category": "Yarn",
                    "important_signals": [
                        {"feature": "standards", "weight": 0.1492, "indicator": "Credible Indicator"},
                        {"feature": "quality", "weight": 0.1345, "indicator": "Credible Indicator"}
                    ],
                    "created_at": "2026-03-05 15:50:00"
                },
                {
                    "user_id": user_id,
                    "title": "Red Dyed Fabric Toxic Seizure Emergency Hoax",
                    "text": "URGENT: Police ordered to confiscate all red cotton clothing across all retail shops due to toxic pigment discovery! Stop wearing red immediately!",
                    "prediction": "POTENTIALLY MISLEADING",
                    "raw_label": "FAKE",
                    "confidence": 0.947,
                    "confidence_percentage": 94.7,
                    "model": "Logistic Regression",
                    "category": "Sustainability",
                    "important_signals": [
                        {"feature": "urgent", "weight": -0.1388, "indicator": "Misleading Indicator"},
                        {"feature": "toxic", "weight": -0.1194, "indicator": "Misleading Indicator"}
                    ],
                    "created_at": "2026-03-08 08:30:00"
                }
            ]
            for p in sample_predictions:
                p["_id"] = str(uuid.uuid4())
                self.predictions.insert_one(p)

    def close(self):
        if self.client:
            self.client.close()
            print("[*] MongoDB connection closed.")

db_instance = Database()

def get_database():
    if db_instance.users is None:
        db_instance.connect()
    return db_instance
