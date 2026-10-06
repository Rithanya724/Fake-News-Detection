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
  FileCheck2,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Activity,
  Layers3
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export const LandingPage = () => {
  const samplePie1 = [
    { name: 'Credible', value: 94 },
    { name: 'Uncertain', value: 6 }
  ];
  const samplePie2 = [
    { name: 'Misleading', value: 89 },
    { name: 'Residual', value: 11 }
  ];

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-16 sm:space-y-24">
      
      {/* 1. Top Hero Section - Luxurious Sand / Cream Card */}
      <div className="ui-card-cream p-6 sm:p-12 md:p-16 relative overflow-hidden">
        {/* Subtle background luxury glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#BA4E42]/10 via-[#DAB87F]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-pill bg-[#EDE3D8] text-[#1C0B0A] text-xs font-semibold tracking-wide border border-[#D8CCC0]">
            <span className="text-[#843932] font-bold">✳</span>
            <span>Empowered by Scikit-Learn NLP & Machine Learning</span>
          </div>

          {/* Editorial Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-[#1C0B0A] leading-[1.08]">
            Smarter Textile <br />
            <span className="text-[#843932]">News Verification</span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-[#5A4642] leading-relaxed max-w-2xl mx-auto font-normal">
            Gain complete and confident control over textile market facts, MSP announcements, export claims, and supply-chain rumors with automated AI-powered verification.
          </p>

          {/* CTA Buttons Matching Reference */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <Link to="/detect">
              <Button size="lg" variant="primary" icon={ScanSearch}>
                Analyze News Now
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" variant="cream" icon={BarChart3}>
                Explore Dashboard
              </Button>
            </Link>
          </div>

          {/* Hero Visual Mockup Grid with Interactive Donut Cards */}
          <div className="pt-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center text-left">
            
            {/* Left Excerpt Text */}
            <div className="md:col-span-4 p-5 rounded-2xl bg-[#F0E6DA]/70 border border-[#D8CCC0] space-y-2 backdrop-blur-sm">
              <span className="text-[10px] font-bold text-[#843932] uppercase tracking-wider block">✳ Intelligence Engine</span>
              <p className="text-xs text-[#4A3835] leading-relaxed font-medium">
                TEX-FACTS helps textile managers, traders, and researchers eliminate manual fact-checking, gain real-time visibility into news authenticity, and make faster, data-driven decisions.
              </p>
            </div>

            {/* Right 2 Floating Donut Stat Cards */}
            <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Card 1: Verified Sample */}
              <div className="p-4 rounded-2xl bg-[#1C0B0A] text-[#EDE3D8] border border-[#451F1B] shadow-card space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-white">Cotton MSP Verification</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#10B981]/20 text-[#34D399] text-[10px] font-bold">REAL</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold font-mono text-white">94.2%</span>
                    <span className="text-[10px] text-[#A8958B] block">Authenticity Score</span>
                  </div>
                  <div className="w-16 h-16">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={samplePie1} innerRadius={18} outerRadius={26} dataKey="value" startAngle={90} endAngle={-270}>
                          <Cell fill="#10B981" />
                          <Cell fill="#28110E" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="text-[11px] text-[#A8958B] border-t border-[#3A1814] pt-2 truncate">
                  Source: Textile Ministry Bulletin
                </div>
              </div>

              {/* Card 2: Misleading Sample */}
              <div className="p-4 rounded-2xl bg-[#1C0B0A] text-[#EDE3D8] border border-[#451F1B] shadow-card space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-white">Export Ban Rumor Alert</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#BA4E42]/20 text-[#E57365] text-[10px] font-bold">MISLEADING</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold font-mono text-white">91.5%</span>
                    <span className="text-[10px] text-[#A8958B] block">Sensationalism Log-Odds</span>
                  </div>
                  <div className="w-16 h-16">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={samplePie2} innerRadius={18} outerRadius={26} dataKey="value" startAngle={90} endAngle={-270}>
                          <Cell fill="#E57365" />
                          <Cell fill="#28110E" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="text-[11px] text-[#A8958B] border-t border-[#3A1814] pt-2 truncate">
                  Source: Unverified WhatsApp Forward
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* 2. Middle Section - Dark Chocolate Background with Quote & Large Stats */}
      <div className="text-center max-w-4xl mx-auto space-y-10">
        
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-pill bg-[#28110E] border border-[#5A2C26] text-[#EDE3D8] text-xs font-semibold uppercase tracking-wider">
          <span className="text-[#E57365]">✳</span>
          <span>About TEX-FACTS</span>
        </div>

        {/* Large Prominent Quote with Asterisks */}
        <p className="text-2xl sm:text-3xl md:text-4xl font-normal text-[#FAF8F5] leading-snug tracking-tight max-w-3xl mx-auto">
          TEX-FACTS <span className="text-[#E57365] font-bold">✳ ✴ ✳</span> helps textile analysts eliminate misinformation panic, gain real-time visibility into <span className="text-white font-semibold underline decoration-[#843932] decoration-2 underline-offset-4">supply-chain performance</span>, and make faster, data-driven decisions through intelligent AI automation.
        </p>

        {/* 3 Large Stat Metrics with Vertical Lines */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-b border-[#451F1B] py-8">
          
          <div className="space-y-1 md:border-r border-[#451F1B] pr-4">
            <span className="text-4xl sm:text-5xl font-extrabold text-white font-mono tracking-tight block">
              98.4%
            </span>
            <span className="text-xs text-[#A8958B] font-medium uppercase tracking-wider">
              Empirical Model Accuracy
            </span>
          </div>

          <div className="space-y-1 md:border-r border-[#451F1B] pr-4">
            <span className="text-4xl sm:text-5xl font-extrabold text-[#E57365] font-mono tracking-tight block">
              80%
            </span>
            <span className="text-xs text-[#A8958B] font-medium uppercase tracking-wider">
              Faster Claim Triage Time
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-4xl sm:text-5xl font-extrabold text-white font-mono tracking-tight block">
              50K+
            </span>
            <span className="text-xs text-[#A8958B] font-medium uppercase tracking-wider">
              Textile Data Tokens Indexed
            </span>
          </div>

        </div>

      </div>

      {/* 3. Lower Section - Golden Metallic Gradient Ambient Card with Essential Tools */}
      <div className="rounded-section p-6 sm:p-12 bg-gradient-to-br from-[#2D1310] via-[#3D1A16] to-[#240E0C] border border-[#68312B] shadow-luxury relative overflow-hidden space-y-10">
        {/* Champagne glow overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#DAB87F]/10 via-transparent to-transparent pointer-events-none" />

        <div className="text-center space-y-3 relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-pill bg-[#FAF8F5] text-[#1C0B0A] text-xs font-semibold uppercase tracking-wider">
            <span className="text-[#843932]">✳</span>
            <span>Our Features</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Essential Tools For <br />
            <span className="text-[#E8D2A7]">Textile Decision Makers</span>
          </h2>

          <p className="text-xs sm:text-sm text-[#D4C4B7]">
            Optimize commodity procurement, subsidy compliance, and export planning with better insights and forecasting.
          </p>
        </div>

        {/* 2 Floating White / Cream Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          
          {/* Feature Card 1 */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#FAF8F5] text-[#1C0B0A] border border-[#E2D6C7] shadow-luxury space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2D6C7]">
              <div>
                <span className="text-xs text-[#7A6662] block uppercase font-bold tracking-wider">Multi-Sector NLP Engine</span>
                <h3 className="text-xl font-bold text-[#1C0B0A] mt-0.5">Automated Sector Classification</h3>
              </div>
              <span className="p-2 rounded-full bg-[#EDE3D8] text-[#843932] font-bold">✳</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-[#EDE3D8]/60 border border-[#D8CCC0]">
                <span className="font-bold text-[#1C0B0A] block">Cotton</span>
                <span className="text-[10px] text-[#7A6662]">MSP & Crop</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#EDE3D8]/60 border border-[#D8CCC0]">
                <span className="font-bold text-[#1C0B0A] block">Silk & Jute</span>
                <span className="text-[10px] text-[#7A6662]">CSB Bulletins</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#EDE3D8]/60 border border-[#D8CCC0]">
                <span className="font-bold text-[#1C0B0A] block">MMF & Yarn</span>
                <span className="text-[10px] text-[#7A6662]">QCO Standards</span>
              </div>
            </div>

            <div className="pt-2">
              <h4 className="font-bold text-sm text-[#1C0B0A]">Real-Time Sector Categorization</h4>
              <p className="text-xs text-[#5A4642] leading-relaxed mt-1">
                Instantly routes articles through sector-specific NLP filters to detect commodity pricing anomalies and hoax schemes.
              </p>
            </div>
          </div>

          {/* Feature Card 2 */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#FAF8F5] text-[#1C0B0A] border border-[#E2D6C7] shadow-luxury space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2D6C7]">
              <div>
                <span className="text-xs text-[#7A6662] block uppercase font-bold tracking-wider">Explainability & Signals</span>
                <h3 className="text-xl font-bold text-[#1C0B0A] mt-0.5">TF-IDF Log-Odds Evidence</h3>
              </div>
              <span className="p-2 rounded-full bg-[#EDE3D8] text-[#843932] font-bold">✳</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2 rounded-lg bg-[#EDE3D8]/60 border border-[#D8CCC0] flex justify-between items-center">
                <span className="font-mono text-[#059669] font-bold">+0.1367 (procurement)</span>
                <span className="text-[10px] font-semibold text-[#059669] uppercase">Credible Signal</span>
              </div>
              <div className="p-2 rounded-lg bg-[#EDE3D8]/60 border border-[#D8CCC0] flex justify-between items-center">
                <span className="font-mono text-[#B84E43] font-bold">−0.1189 (midnight ban)</span>
                <span className="text-[10px] font-semibold text-[#B84E43] uppercase">Sensational Signal</span>
              </div>
            </div>

            <div className="pt-2">
              <h4 className="font-bold text-sm text-[#1C0B0A]">Transparent Machine Learning</h4>
              <p className="text-xs text-[#5A4642] leading-relaxed mt-1">
                Visualizes the exact tokens and linguistic indicators driving model probability scores for clear stakeholder audits.
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* 4. Bottom Call To Action */}
      <div className="text-center py-6 space-y-4">
        <h3 className="text-2xl font-bold text-white">Ready to verify textile news?</h3>
        <p className="text-xs sm:text-sm text-[#A8958B]">
          Paste any headline or article excerpt to inspect calibrated probability scores.
        </p>
        <Link to="/detect" className="inline-block pt-2">
          <Button size="lg" icon={ScanSearch}>
            Start Instant Analysis
          </Button>
        </Link>
      </div>

    </div>
  );
};
