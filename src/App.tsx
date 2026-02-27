import React, { useState } from 'react';
import { LayoutDashboard, Maximize, Map, Fish, ArrowRight, Info, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import AppSpreading from './AppSpreading';
import AppArea from './AppArea';

type AppMode = 'spreading' | 'area' | 'home';

export default function App() {
  const [mode, setMode] = useState<AppMode>('home');

  if (mode === 'spreading') {
    return (
      <div className="relative">
        <button 
          onClick={() => setMode('home')}
          className="fixed bottom-6 left-6 z-50 bg-slate-950 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 hover:bg-slate-900 transition-all text-sm font-bold border border-white/10"
        >
          <LayoutDashboard className="w-4 h-4" />
          Torna alla Home
        </button>
        <AppSpreading />
      </div>
    );
  }

  if (mode === 'area') {
    return (
      <div className="relative">
        <button 
          onClick={() => setMode('home')}
          className="fixed bottom-6 left-6 z-50 bg-emerald-900 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 hover:bg-emerald-800 transition-all text-sm font-bold"
        >
          <LayoutDashboard className="w-4 h-4" />
          Torna alla Home
        </button>
        <AppArea />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-6 py-12 md:py-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl w-full text-center space-y-16"
      >
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-widest">
            <Fish className="w-4 h-4" />
            RAS AD-Sludge Spreading Suite
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-tight">
            Gestione Sostenibile <br /> <span className="text-emerald-600">Fanghi RAS</span>
          </h1>
          <p className="text-slate-500 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Strumenti avanzati per l'integrazione tra acquacoltura a ricircolo (RAS), digestione anaerobica e spandimento agronomico.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.button
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setMode('spreading')}
            className="glass-card p-10 text-left group transition-all hover:border-emerald-500/50 hover:shadow-2xl relative overflow-hidden"
          >
            <div className="bg-emerald-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Fish className="w-7 h-7 text-emerald-600 group-hover:text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">RAS AD-Sludge Biomass</h3>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed">
              Ottimizza la produzione ittica. Calcola la biomassa massima sostenibile per ettaro rispettando i limiti di azoto (ZVN).
            </p>
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
              Inizia Calcolo <ArrowRight className="w-4 h-4" />
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setMode('area')}
            className="glass-card p-10 text-left group transition-all hover:border-emerald-500/50 hover:shadow-2xl relative overflow-hidden"
          >
            <div className="bg-emerald-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Map className="w-7 h-7 text-emerald-600 group-hover:text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">RAS AD-Sludge Land</h3>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed">
              Pianifica il territorio. Determina la superficie agricola necessaria per assorbire i nutrienti prodotti dalla tua biomassa.
            </p>
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
              Analisi Territoriale <ArrowRight className="w-4 h-4" />
            </div>
          </motion.button>
        </div>

        <div className="py-12 px-8 bg-slate-100 rounded-3xl border border-slate-200 text-center">
          <p className="text-slate-600 font-medium">
            Sviluppato nell'ambito del <span className="text-slate-900 font-bold">Progetto Circular Rainbow</span> — Università di Udine
          </p>
        </div>
      </motion.div>
    </div>
  );
}
