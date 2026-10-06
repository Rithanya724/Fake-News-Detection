import React from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { 
  AlertCircle, 
  Cpu, 
  Layers, 
  Code, 
  Lightbulb, 
  ArrowDown,
  Sparkles
} from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 space-y-10">
      
      {/* Header */}
      <PageHeader
        title="About TEX-FACTS"
        subtitle="Natural Language Processing and Machine Learning system for textile industry misinformation detection and empirical claim verification."
      />

      {/* Structured Roadmap: Problem -> Methodology -> Architecture -> Tech -> Limitations -> Future */}
      <div className="space-y-6">
        
        {/* 1. Problem Statement */}
        <div className="ui-card p-6 sm:p-8 space-y-3">
          <div className="flex items-center space-x-2 text-[#E57365]">
            <span className="text-base font-bold">✳</span>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">1. Domain Problem Statement</h3>
          </div>
          <p className="text-xs sm:text-sm text-[#D4C4B7] leading-relaxed">
            The textile and apparel supply chain spans complex agricultural, manufacturing, and international export ecosystems (e.g., raw cotton MSP procurement, raw silk tariffs, power subsidies, synthetic yarn quality orders). Sensationalist rumors and fabricated subsidy schemes create panic inventory liquidation, artificial price volatility, and supply chain bottlenecks. This system provides domain-adapted NLP classification specifically for textile vocabulary.
          </p>
        </div>

        {/* 2. Methodology */}
        <div className="ui-card p-6 sm:p-8 space-y-4">
          <div className="flex items-center space-x-2 text-[#E8D2A7]">
            <span className="text-base font-bold">✳</span>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">2. NLP & Machine Learning Methodology</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-4 rounded-xl bg-[#180908] border border-[#451F1B] space-y-1.5">
              <strong className="text-white block text-sm">Deterministic NLP Cleaning</strong>
              <span className="text-[#A8958B] leading-relaxed block">HTML entity unescaping, regex URL stripping, Unicode NFKD normalization, and domain stopword pruning.</span>
            </div>
            <div className="p-4 rounded-xl bg-[#180908] border border-[#451F1B] space-y-1.5">
              <strong className="text-white block text-sm">TF-IDF Feature Space</strong>
              <span className="text-[#A8958B] leading-relaxed block">Sublinear term frequency scaling, unigram + bigram n-gram representation with 976 statistical vocabulary tokens.</span>
            </div>
            <div className="p-4 rounded-xl bg-[#180908] border border-[#451F1B] space-y-1.5">
              <strong className="text-white block text-sm">Logistic Classification</strong>
              <span className="text-[#A8958B] leading-relaxed block">L2-regularized logistic regression with calibrated sigmoid probabilities and per-feature log-odds interpretability.</span>
            </div>
          </div>
        </div>

        {/* 3. System Architecture */}
        <div className="ui-card p-6 sm:p-8 space-y-3">
          <div className="flex items-center space-x-2 text-[#34D399]">
            <span className="text-base font-bold">✳</span>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">3. Architecture & Data Flow</h3>
          </div>
          <div className="p-4 rounded-xl bg-[#180908] border border-[#451F1B] text-xs font-mono text-[#E8D2A7] overflow-x-auto">
            React Frontend (Vite + Tailwind) ──[REST API]──▶ FastAPI Backend ──▶ Preprocessing & TF-IDF ──▶ Logistic Regression ──▶ MongoDB Datastore
          </div>
        </div>

        {/* 4. Technology Stack */}
        <div className="ui-card p-6 sm:p-8 space-y-4">
          <div className="flex items-center space-x-2 text-[#FB7185]">
            <span className="text-base font-bold">✳</span>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">4. Technology Stack</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-[#180908] border border-[#451F1B]">
              <span className="text-[#A8958B] block text-[10px] uppercase font-semibold">Frontend</span>
              <span className="text-white font-bold">React, Vite, Recharts</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#180908] border border-[#451F1B]">
              <span className="text-[#A8958B] block text-[10px] uppercase font-semibold">Backend</span>
              <span className="text-white font-bold">FastAPI, Python 3.11</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#180908] border border-[#451F1B]">
              <span className="text-[#A8958B] block text-[10px] uppercase font-semibold">Machine Learning</span>
              <span className="text-white font-bold">Scikit-learn, Pandas</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#180908] border border-[#451F1B]">
              <span className="text-[#A8958B] block text-[10px] uppercase font-semibold">Database</span>
              <span className="text-white font-bold">MongoDB & PyMongo</span>
            </div>
          </div>
        </div>

        {/* 5. System Limitations */}
        <div className="ui-card p-6 sm:p-8 space-y-3">
          <div className="flex items-center space-x-2 text-[#A8958B]">
            <span className="text-base font-bold">✳</span>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">5. Academic Disclosures & Boundaries</h3>
          </div>
          <ul className="text-xs text-[#A8958B] space-y-2 list-disc list-inside leading-relaxed">
            <li>The platform evaluates lexical indicators and linguistic stylometry learned from corpus benchmarks; it does not replace official trade gazettes.</li>
            <li>Out-of-domain articles differing heavily from textile manufacturing topics may produce lower confidence scores.</li>
          </ul>
        </div>

      </div>

    </div>
  );
};
