/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LayoutDashboard, Maximize, Map, Fish, ArrowRight, Info, Mail, Globe, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
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
          className="fixed bottom-6 left-6 z-50 bg-brand-primary text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 hover:bg-brand-secondary transition-all text-sm font-bold"
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
        {/* Hero Section */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-bold uppercase tracking-widest">
            <Fish className="w-4 h-4" />
            RAS AD-Sludge Spreading Suite
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-tight">
            Gestione Sostenibile <br /> <span className="text-accent">Fanghi RAS</span>
          </h1>
          <p className="text-slate-500 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Strumenti avanzati per l'integrazione tra acquacoltura a ricircolo (RAS), digestione anaerobica e spandimento agronomico.
          </p>
        </div>

        {/* Module Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Spreading Card */}
          <motion.button
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setMode('spreading')}
            className="glass-card p-10 text-left group transition-all hover:border-accent/50 hover:shadow-2xl relative overflow-hidden"
          >
            <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Fish className="w-32 h-32 text-accent" />
            </div>
            <div className="bg-accent/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-accent group-hover:text-white transition-colors">
              <Fish className="w-7 h-7 text-accent group-hover:text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">RAS AD-Sludge Biomass</h3>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed">
              Ottimizza la produzione ittica. Calcola la biomassa massima sostenibile per ettaro rispettando i limiti di azoto (ZVN).
            </p>
            <div className="flex items-center gap-2 text-accent font-bold text-sm">
              Inizia Calcolo <ArrowRight className="w-4 h-4" />
            </div>
          </motion.button>

          {/* Area Card */}
          <motion.button
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setMode('area')}
            className="glass-card p-10 text-left group transition-all hover:border-emerald-500/50 hover:shadow-2xl relative overflow-hidden"
          >
            <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Map className="w-32 h-32 text-emerald-600" />
            </div>
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

        {/* Description Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left pt-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-accent font-bold text-xs uppercase tracking-widest">
              <Info className="w-4 h-4" />
              La Suite
            </div>
            <h4 className="text-xl font-bold text-slate-900">Integrazione Circolare</h4>
            <p className="text-sm text-slate-500 leading-relaxed">
              Questa suite nasce per rispondere alla sfida della gestione dei fanghi nei sistemi RAS. Attraverso la co-digestione anaerobica (AD), i fanghi vengono trasformati in digestato, una risorsa preziosa per l'agricoltura.
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4" />
              Conformità
            </div>
            <h4 className="text-xl font-bold text-slate-900">Normativa Nitrati</h4>
            <p className="text-sm text-slate-500 leading-relaxed">
              I calcoli integrano i limiti imposti dalla Direttiva Nitrati (170 kg N/ha/anno per Zone Vulnerabili), garantendo che la pianificazione sia sempre in linea con i vincoli ambientali vigenti.
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest">
              <Maximize className="w-4 h-4" />
              Ottimizzazione
            </div>
            <h4 className="text-xl font-bold text-slate-900">Efficienza RAS</h4>
            <p className="text-sm text-slate-500 leading-relaxed">
              Considerando parametri chiave come l'FCR (Feed Conversion Ratio) e il TS Sludge, lo strumento permette di simulare scenari diversi per massimizzare la sostenibilità dell'impianto.
            </p>
          </div>
        </div>

        {/* Project Attribution */}
        <div className="py-12 px-8 bg-slate-100 rounded-3xl border border-slate-200 text-center">
          <p className="text-slate-600 font-medium">
            Sviluppato nell'ambito del <span className="text-slate-900 font-bold">Progetto Circular Rainbow</span> — Università di Udine
          </p>
        </div>

        {/* Footer */}
        <div className="pt-12 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6 pb-12">
          <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            <span>Precisione</span>
            <div className="w-1 h-1 rounded-full bg-slate-300" />
            <span>Sostenibilità</span>
            <div className="w-1 h-1 rounded-full bg-slate-300" />
            <span>Normativa</span>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">
              RAS AD-Sludge Spreading Suite v1.1
            </p>
            <p className="text-[10px] text-slate-300 font-medium">
              © {new Date().getFullYear()} - Strumento professionale per l'acquacoltura circolare.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
