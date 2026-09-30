"""
NLP Preprocessing Pipeline for Backend Prediction Service.
Strictly identical to ml/preprocessing.py to guarantee deterministic inference.
"""

import re
import html
import unicodedata
from typing import List

STOPWORDS = {
    "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", 
    "aren't", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", 
    "but", "by", "can", "can't", "cannot", "could", "couldn't", "did", "didn't", "do", "does", 
    "doesn't", "doing", "don't", "down", "during", "each", "few", "for", "from", "further", "had", 
    "hadn't", "has", "hasn't", "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her", 
    "here", "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i", "i'd", 
    "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't", "it", "it's", "its", "itself", 
    "let's", "me", "more", "most", "mustn't", "my", "myself", "no", "nor", "not", "of", "off", 
    "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", 
    "own", "same", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "so", 
    "some", "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", 
    "then", "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've", 
    "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "wasn't", 
    "we", "we'd", "we'll", "we're", "we've", "were", "weren't", "what", "what's", "when", 
    "when's", "where", "where's", "which", "while", "who", "who's", "whom", "why", "why's", 
    "with", "won't", "would", "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your", 
    "yours", "yourself", "yourselves"
}

def remove_html(text: str) -> str:
    if not isinstance(text, str):
        return ""
    text = html.unescape(text)
    clean_re = re.compile(r'<.*?>')
    return clean_re.sub(' ', text)

def remove_urls(text: str) -> str:
    if not isinstance(text, str):
        return ""
    url_pattern = re.compile(r'https?://\S+|www\.\S+')
    return url_pattern.sub(' ', text)

def remove_special_characters(text: str) -> str:
    if not isinstance(text, str):
        return ""
    text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode('utf-8', 'ignore')
    text = re.sub(r'[^a-zA-Z0-9\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def tokenize_text(text: str) -> List[str]:
    if not isinstance(text, str):
        return []
    return [token for token in text.split() if token]

def remove_stopwords(tokens: List[str]) -> List[str]:
    return [token for token in tokens if token.lower() not in STOPWORDS and len(token) > 2]

def clean_text(text: str) -> str:
    if not text:
        return ""
    text = text.lower()
    text = remove_html(text)
    text = remove_urls(text)
    text = remove_special_characters(text)
    return text

def preprocess_text(text: str) -> str:
    cleaned = clean_text(text)
    tokens = tokenize_text(cleaned)
    filtered_tokens = remove_stopwords(tokens)
    return " ".join(filtered_tokens)
