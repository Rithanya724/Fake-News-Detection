import React from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { 
  AlertCircle, 
  Cpu, 
  Layers, 
  Code, 
  Lightbulb, 
  ArrowDown
} from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 space-y-10">
      
      {/* Header */}
      <PageHeader
        title="About TEX-FACTS"
        subtitle="Natural Language Processing and Machine Learning system for textile industry misinformation detection."
      />

      {/* Structured Roadmap: Problem -> Methodology -> Architecture -> Tech -> Limitations -> Future */}
      <div className="space-y-6">
        
        {/* 1. Problem Statement */}
        <div className="ui-card p-6 space-y-3">
          <div className="flex items-center space-x-2 text-amber-400">
            <AlertCircle className="w-4 h-4" />
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">1. Problem Statement</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            The textile and apparel supply chain involves complex agricultural, manufacturing, and export networks (e.g., cotton harvest MSP, raw silk duties, power tariffs, synthetic yarn prices). Sensationalist rumors and fabricated subsidy schemes cause panic inventory liquidation and market distortions. This project creates a specialized NLP classification system tailored specifically to textile terminology.
          </p>
        </div>

        {/* 2. Methodology */}
        <div className="ui-card p-6 space-y-3">
          <div className="flex items-center space-x-2 text-emerald-400">
            <Cpu className="w-4 h-4" />
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">2. NLP & ML Methodology</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-400">
            <div className="p-3.5 rounded-input bg-[#172033] border border-[#263244] space-y-1">
              <strong className="text-slate-200 block">Deterministic Preprocessing</strong>
              <span>HTML unescaping, regex URL stripping, Unicode NFKD normalization, and stopword removal.</span>
            </div>
            <div className="p-3.5 rounded-input bg-[#172033] border border-[#263244] space-y-1">
              <strong className="text-slate-200 block">TF-IDF Vectorization</strong>
              <span>Sublinear term frequency, unigram + bigram representation, and a vocabulary of 976 domain features.</span>
            </div>
            <div className="p-3.5 rounded-input bg-[#172033] border border-[#263244] space-y-1">
              <strong className="text-slate-200 block">Logistic Regression</strong>
              <span>L2 regularization and sigmoid class probability log-odds estimation.</span>
            </div>
          </div>
        </div>

        {/* 3. System Architecture */}
        <div className="ui-card p-6 space-y-3">
          <div className="flex items-center space-x-2 text-cyan-400">
            <Layers className="w-4 h-4" />
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">3. Architecture Flow</h3>
          </div>
          <div className="p-4 rounded-input bg-[#0B1120] border border-[#263244] text-xs font-mono text-slate-300 overflow-x-auto">
            React Frontend (Vite) ──[HTTP REST]──▶ FastAPI Backend ──▶ NLP & TF-IDF ──▶ Logistic Regression ──▶ MongoDB
          </div>
        </div>

        {/* 4. Technology Stack */}
        <div className="ui-card p-6 space-y-3">
          <div className="flex items-center space-x-2 text-indigo-400">
            <Code className="w-4 h-4" />
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">4. Technology Stack</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-input bg-[#172033] border border-[#263244]">
              <span className="text-slate-500 block text-[10px]">Frontend</span>
              <span className="text-slate-200 font-medium">React, Vite, Tailwind</span>
            </div>
            <div className="p-3 rounded-input bg-[#172033] border border-[#263244]">
              <span className="text-slate-500 block text-[10px]">Backend</span>
              <span className="text-slate-200 font-medium">FastAPI, Uvicorn</span>
            </div>
            <div className="p-3 rounded-input bg-[#172033] border border-[#263244]">
              <span className="text-slate-500 block text-[10px]">ML & NLP</span>
              <span className="text-slate-200 font-medium">Scikit-learn, Pandas</span>
            </div>
            <div className="p-3 rounded-input bg-[#172033] border border-[#263244]">
              <span className="text-slate-500 block text-[10px]">Database</span>
              <span className="text-slate-200 font-medium">MongoDB (PyMongo)</span>
            </div>
          </div>
        </div>

        {/* 5. System Limitations */}
        <div className="ui-card p-6 space-y-3">
          <div className="flex items-center space-x-2 text-slate-400">
            <AlertCircle className="w-4 h-4" />
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">5. Academic Disclosures & Limitations</h3>
          </div>
          <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside leading-relaxed">
            <li>The system evaluates lexical tone and stylistic statistical patterns; it does not connect to a real-world legal registry.</li>
            <li>Out-of-domain articles differing heavily from textile manufacturing and commodity topics may produce lower confidence predictions.</li>
          </ul>
        </div>

        {/* 6. Future Enhancements */}
        <div className="ui-card p-6 space-y-3">
          <div className="flex items-center space-x-2 text-emerald-400">
            <Lightbulb className="w-4 h-4" />
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">6. Future Enhancements</h3>
          </div>
          <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside leading-relaxed">
            <li>Fine-tuned Transformer architectures (e.g. RoBERTa / DeBERTa).</li>
            <li>Multilingual NLP support for vernacular textile clusters (Tamil, Hindi, Gujarati).</li>
            <li>Automated web scrapers indexing Ministry of Textiles and DGFT notifications.</li>
          </ul>
        </div>

      </div>

    </div>
  );
};
