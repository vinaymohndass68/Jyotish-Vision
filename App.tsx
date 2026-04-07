
import React, { useState, useEffect, useRef } from 'react';
import { BirthDetails, AstrologyResults, CompatibilityResults } from './types';
import { calculateAstrology, calculateCompatibility } from './services/geminiService';
import NorthIndianChart from './components/NorthIndianChart';
import { Sparkles, Calendar, Clock, MapPin, Loader2, Info, Moon, Sun, Star, Download, Search, Settings, RefreshCw, Compass, Users, Heart, Zap } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<AstrologyResults | null>(null);
  const [compResults, setCompResults] = useState<CompatibilityResults | null>(null);
  const [mode, setMode] = useState<'single' | 'twin'>('single');
  
  const [details1, setDetails1] = useState<BirthDetails>({ dob: '', tob: '', pob: '' });
  const [details2, setDetails2] = useState<BirthDetails>({ dob: '', tob: '', pob: '' });
  
  const [p1Suggestions, setP1Suggestions] = useState<any[]>([]);
  const [p2Suggestions, setP2Suggestions] = useState<any[]>([]);
  const [isSearching1, setIsSearching1] = useState(false);
  const [isSearching2, setIsSearching2] = useState(false);
  const [showS1, setShowS1] = useState(false);
  const [showS2, setShowS2] = useState(false);
  
  const reportRef = useRef<HTMLDivElement>(null);

  // Place Search Logic for Person 1
  useEffect(() => {
    if (details1.pob.length < 3) return;
    const timer = setTimeout(async () => {
      setIsSearching1(true);
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(details1.pob)}&limit=5`);
        setP1Suggestions(await res.json());
        setShowS1(true);
      } finally { setIsSearching1(false); }
    }, 600);
    return () => clearTimeout(timer);
  }, [details1.pob]);

  // Place Search Logic for Person 2
  useEffect(() => {
    if (details2.pob.length < 3) return;
    const timer = setTimeout(async () => {
      setIsSearching2(true);
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(details2.pob)}&limit=5`);
        setP2Suggestions(await res.json());
        setShowS2(true);
      } finally { setIsSearching2(false); }
    }, 600);
    return () => clearTimeout(timer);
  }, [details2.pob]);

  const handleStartOver = () => {
    setResults(null);
    setCompResults(null);
    setDetails1({ dob: '', tob: '', pob: '' });
    setDetails2({ dob: '', tob: '', pob: '' });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (mode === 'single') {
        const data = await calculateAstrology(details1);
        setResults(data);
      } else {
        const data = await calculateCompatibility(details1, details2);
        setCompResults(data);
      }
    } catch (err) {
      setError("Failed to calculate cosmic alignment. Please check details.");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    if (!reportRef.current) return;
    setLoading(true);
    try {
      const canvas = await html2canvas(reportRef.current, { scale: 2, useCORS: true, backgroundColor: '#0f172a' });
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Jyotish_Insight_${Date.now()}.pdf`);
    } finally { setLoading(false); }
  };

  const renderBirthForm = (details: BirthDetails, setDetails: any, label: string, isSearching: boolean, suggestions: any[], showS: boolean, setShowS: any) => (
    <div className="space-y-6 p-6 bg-slate-800/30 rounded-2xl border border-slate-700/50">
      <h4 className="text-amber-400 font-cinzel text-sm uppercase tracking-widest flex items-center gap-2">
        <Users className="w-4 h-4" /> {label}
      </h4>
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <label className="text-xs text-slate-400 font-medium">Date of Birth</label>
          <input type="date" value={details.dob} onChange={e => setDetails({ ...details, dob: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white" />
        </div>
        <div className="space-y-2">
          <label className="text-xs text-slate-400 font-medium">Time of Birth</label>
          <input type="time" step="1" value={details.tob} onChange={e => setDetails({ ...details, tob: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white" />
        </div>
        <div className="space-y-2 relative">
          <label className="text-xs text-slate-400 font-medium">Place of Birth</label>
          <div className="relative">
            <input type="text" placeholder="City, Country" value={details.pob} onChange={e => setDetails({ ...details, pob: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white" />
            {isSearching && <Loader2 className="absolute right-3 top-3 w-4 h-4 animate-spin text-amber-500/50" />}
          </div>
          {showS && suggestions.length > 0 && (
            <div className="absolute z-[100] left-0 right-0 top-full mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden max-h-40 overflow-y-auto">
              {suggestions.map((s, i) => (
                <button key={i} type="button" onClick={() => { setDetails({ ...details, pob: s.display_name }); setShowS(false); }} className="w-full text-left px-4 py-2 hover:bg-slate-700 text-xs text-slate-300 border-b border-slate-700/50 last:border-0">{s.display_name}</button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-inter">
      <header className="border-b border-amber-500/20 py-8 text-center bg-slate-900/40 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Sparkles className="text-amber-400 w-8 h-8" />
            <h1 className="text-4xl font-cinzel font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200">Jyotish Vision</h1>
          </div>
          <div className="flex justify-center gap-4 mt-6">
            <button onClick={() => { setMode('single'); handleStartOver(); }} className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${mode === 'single' ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' : 'bg-slate-800 text-slate-400'}`}>Soul Map</button>
            <button onClick={() => { setMode('twin'); handleStartOver(); }} className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${mode === 'twin' ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' : 'bg-slate-800 text-slate-400'}`}>Twin Soul Connection</button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-6xl">
        {!results && !compResults && (
          <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in zoom-in-95 duration-700">
            <div className={`grid grid-cols-1 ${mode === 'twin' ? 'md:grid-cols-2' : ''} gap-8`}>
              {renderBirthForm(details1, setDetails1, mode === 'single' ? "Your Details" : "Soul 1 Details", isSearching1, p1Suggestions, showS1, setShowS1)}
              {mode === 'twin' && renderBirthForm(details2, setDetails2, "Soul 2 Details", isSearching2, p2Suggestions, showS2, setShowS2)}
            </div>
            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-amber-900/20 flex items-center justify-center gap-3 transition-all disabled:opacity-50 text-lg uppercase tracking-widest">
              {loading ? <><Loader2 className="animate-spin" /> Aligning Cosmic Threads...</> : <><Star /> {mode === 'single' ? 'Generate Soul Map' : 'Discover Soul Connection'}</>}
            </button>
            {error && <p className="text-red-400 text-center bg-red-950/20 p-4 rounded-xl border border-red-500/30">{error}</p>}
          </form>
        )}

        {(results || compResults) && (
          <div className="space-y-12">
            <div className="flex justify-between items-center bg-slate-900/60 p-4 rounded-2xl border border-slate-800 no-print">
               <button onClick={handleStartOver} className="flex items-center gap-2 px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all"><RefreshCw className="w-4 h-4" /> Start Over</button>
               <button onClick={downloadPDF} className="flex items-center gap-2 px-6 py-2 bg-amber-600 hover:bg-amber-500 rounded-xl transition-all"><Download className="w-4 h-4" /> Export Report</button>
            </div>

            <div ref={reportRef} className="space-y-12">
              {results && (
                <div className="space-y-12">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <NorthIndianChart data={results.lagnaChart} title="Birth (Lagna)" />
                    <NorthIndianChart data={results.rashiChart} title="Moon (Rashi)" />
                    <NorthIndianChart data={results.navamshaChart} title="Soul (D9)" />
                  </div>
                  <div className="bg-slate-900/40 p-8 rounded-3xl border border-slate-800">
                    <h3 className="text-2xl font-cinzel text-amber-400 mb-6 flex items-center gap-3"><Sun /> Soul Signature Analysis</h3>
                    <p className="text-slate-300 leading-relaxed whitespace-pre-wrap text-lg font-light">{results.interpretation}</p>
                  </div>
                </div>
              )}

              {compResults && (
                <div className="space-y-12">
                  <div className="text-center space-y-4">
                    <h2 className="text-5xl font-cinzel text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-amber-500">The Eternal Bond</h2>
                    <div className="flex justify-center items-center gap-4">
                      <div className="px-6 py-3 bg-slate-900/80 rounded-full border border-amber-500/40">
                        <span className="text-slate-400 text-xs uppercase tracking-widest mr-3">Guna Milan:</span>
                        <span className="text-3xl font-bold text-amber-400">{compResults.gunaMilanScore}</span>
                        <span className="text-slate-500 text-xl"> / 36</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-8">
                      <h3 className="text-xl font-cinzel text-amber-400 flex items-center gap-2 border-b border-amber-500/20 pb-2"><Heart className="text-red-500" /> Soul 1 Chart</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <NorthIndianChart data={compResults.person1.lagnaChart} title="Lagna" />
                        <NorthIndianChart data={compResults.person1.navamshaChart} title="D9" />
                      </div>
                    </div>
                    <div className="space-y-8">
                      <h3 className="text-xl font-cinzel text-amber-400 flex items-center gap-2 border-b border-amber-500/20 pb-2"><Heart className="text-red-500" /> Soul 2 Chart</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <NorthIndianChart data={compResults.person2.lagnaChart} title="Lagna" />
                        <NorthIndianChart data={compResults.person2.navamshaChart} title="D9" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                      <section className="bg-slate-900/60 p-8 rounded-3xl border border-slate-800">
                        <h4 className="text-xl font-cinzel text-amber-400 mb-4 flex items-center gap-2"><Sparkles /> Soul Connection Analysis</h4>
                        <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{compResults.soulConnectionAnalysis}</p>
                      </section>
                      <section className="bg-slate-900/60 p-8 rounded-3xl border border-slate-800">
                        <h4 className="text-xl font-cinzel text-amber-400 mb-4 flex items-center gap-2"><Zap className="text-blue-400" /> Karmic Ties & Destiny</h4>
                        <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{compResults.karmicTies}</p>
                      </section>
                    </div>
                    <div className="space-y-8">
                      <section className="bg-green-950/20 p-6 rounded-3xl border border-green-500/20">
                        <h4 className="text-sm font-bold text-green-400 uppercase tracking-widest mb-4">Cosmic Strengths</h4>
                        <ul className="space-y-2">
                          {compResults.strengths.map((s, i) => <li key={i} className="text-slate-300 text-sm flex items-start gap-2"><span className="text-green-500 mt-1">•</span> {s}</li>)}
                        </ul>
                      </section>
                      <section className="bg-amber-950/20 p-6 rounded-3xl border border-amber-500/20">
                        <h4 className="text-sm font-bold text-amber-400 uppercase tracking-widest mb-4">Growth Areas</h4>
                        <ul className="space-y-2">
                          {compResults.challenges.map((c, i) => <li key={i} className="text-slate-300 text-sm flex items-start gap-2"><span className="text-amber-500 mt-1">•</span> {c}</li>)}
                        </ul>
                      </section>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-slate-900 py-12 text-center text-slate-600 text-xs no-print">
        <p>© {new Date().getFullYear()} Jyotish Vision. Traditional Nirayana calculations for modern souls.</p>
      </footer>
    </div>
  );
};

export default App;
