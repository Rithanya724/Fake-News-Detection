import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ScanSearch, 
  BarChart3, 
  Cpu, 
  Layers, 
  Sparkles, 
  ArrowRight,
  CheckCircle,
  FileCheck2
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export const LandingPage = () => {
  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-20">
      
      {/* Clean Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-6">
        <Badge variant="emerald" size="md">
          <Sparkles className="w-3 h-3" />
          <span>Capstone Research System</span>
        </Badge>

        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
          Textile news, <br />
          <span className="text-emerald-400">analyzed with NLP.</span>
        </h1>

        <p className="text-base text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
          A machine-learning platform for identifying potentially misleading textile industry news, rumors, and policy claims.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link to="/detect">
            <Button size="lg" icon={ScanSearch}>
              Analyze News
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="secondary" size="lg" icon={BarChart3}>
              Explore Dashboard
            </Button>
          </Link>
        </div>
      </div>

      {/* 3 Simple Feature Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="ui-card p-6 space-y-2.5">
          <div className="w-10 h-10 rounded-lg bg-[#172033] border border-[#263244] flex items-center justify-center text-emerald-400 mb-2">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-white">NLP Processing</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Cleans and normalizes article text by removing HTML entities, URLs, punctuation, and non-informative stopwords.
          </p>
        </div>

        <div className="ui-card p-6 space-y-2.5">
          <div className="w-10 h-10 rounded-lg bg-[#172033] border border-[#263244] flex items-center justify-center text-cyan-400 mb-2">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-white">TF-IDF Vectorization</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Converts unstructured textile text into 976 high-dimensional numerical feature tokens with sublinear scaling.
          </p>
        </div>

        <div className="ui-card p-6 space-y-2.5">
          <div className="w-10 h-10 rounded-lg bg-[#172033] border border-[#263244] flex items-center justify-center text-indigo-400 mb-2">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-white">Machine Learning</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Classifies articles using Logistic Regression with calibrated sigmoid confidence scores and feature log-odds evidence.
          </p>
        </div>
      </div>

      {/* Horizontal Pipeline Steps */}
      <div className="ui-card p-8 space-y-6">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-white">How the System Works</h2>
          <p className="text-xs text-slate-400">End-to-end processing pipeline from client input to MongoDB analytics.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
          {[
            { step: '01', title: 'Ingestion', desc: 'Captures headline or full news body' },
            { step: '02', title: 'Preprocessing', desc: 'Cleans, strips URLs, and tokenizes' },
            { step: '03', title: 'TF-IDF', desc: 'Vectorizes unigrams & bigrams' },
            { step: '04', title: 'Classification', desc: 'Computes probability & log-odds' },
            { step: '05', title: 'Analytics', desc: 'Logs result to MongoDB dashboard' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-input bg-[#172033] border border-[#263244] space-y-1.5">
              <span className="text-[11px] font-mono font-bold text-emerald-400">{item.step}</span>
              <h4 className="text-sm font-semibold text-white">{item.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Academic Distinction Notice */}
      <div className="ui-card p-6 sm:p-8 space-y-4">
        <h3 className="text-base font-bold text-white">Academic Framing & Distinction</h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          This application clearly distinguishes between three separate analytical capabilities:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          <div className="p-4 rounded-input bg-[#172033] border border-[#263244] space-y-1.5">
            <span className="text-xs font-semibold text-emerald-400 block">1. ML Statistical Classification</span>
            <p className="text-xs text-slate-400 leading-relaxed">
              Detects lexical patterns and sensationalist wording learned from training corpus benchmarks.
            </p>
          </div>
          <div className="p-4 rounded-input bg-[#172033] border border-[#263244] space-y-1.5">
            <span className="text-xs font-semibold text-slate-200 block">2. Source Verification</span>
            <p className="text-xs text-slate-400 leading-relaxed">
              Assesses publisher credibility and domain reputation (requires web registry indexing).
            </p>
          </div>
          <div className="p-4 rounded-input bg-[#172033] border border-[#263244] space-y-1.5">
            <span className="text-xs font-semibold text-slate-200 block">3. Evidence Fact-Checking</span>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cross-references claims against verified government and trade gazettes.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
