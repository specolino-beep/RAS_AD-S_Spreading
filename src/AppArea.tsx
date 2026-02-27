/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Activity, 
  Droplets, 
  Fish, 
  Info, 
  LayoutDashboard, 
  Leaf, 
  Scale, 
  TrendingUp,
  AlertCircle,
  Maximize,
  Map
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { motion } from 'framer-motion';
import { 
  DigestateParams, 
  AgronomicParams, 
  MixtureParams, 
  BiomassParams, 
  AreaCalculationResults 
} from './types';

export default function AppArea() {
  // --- State for Inputs ---
  const [targetBiomass, setTargetBiomass] = useState<number>(5000); // kg di pesce

  const [digestate, setDigestate] = useState<DigestateParams>({
    tsPercent: 3.4,
    nTotPercentTS: 4.1
  });

  const [agronomic, setAgronomic] = useState<AgronomicParams>({
    maxNitrogenLoad: 170,
    singleInterventionLoad: 40
  });

  const [mixture, setMixture] = useState<MixtureParams>({
    rRatio: 10,
    tsInoculum: 5.5,
    vsInoculum: 4.1,
    tsSludge: 1.2,
    vsSludge: 0.9 // Sarà auto-calcolato al 75% di tsSludge
  });

  const [biomass, setBiomass] = useState<BiomassParams>({
    sludgeProductionRate: 0.12,
    fcr: 1.1
  });

  // --- Calculations ---
  const results = useMemo((): AreaCalculationResults => {
    // 1. Concentrazione Azoto nel digestato
    const tsGL = digestate.tsPercent * 10;
    const nTotGL = (tsGL * digestate.nTotPercentTS) / 100;

    // 2. Produzione Solidi Totali (TS) dal pesce
    const totalTsSludge = targetBiomass * biomass.fcr * biomass.sludgeProductionRate;

    // 3. Massa di fango (Ms) prodotta
    const msKg = mixture.tsSludge > 0 ? (totalTsSludge / (mixture.tsSludge / 100)) : 0;

    // 4. Massa totale digestato (Mt)
    const mtKg = mixture.vsInoculum > 0 
      ? msKg * (1 + (mixture.rRatio * mixture.vsSludge) / mixture.vsInoculum)
      : 0;

    // 5. Azoto Totale prodotto (kg N)
    const totalNitrogenKg = mtKg * (nTotGL / 1000);

    // 6. Superficie necessaria (ha)
    const requiredAreaHa = agronomic.maxNitrogenLoad > 0 ? totalNitrogenKg / agronomic.maxNitrogenLoad : 0;

    return {
      totalTsSludge,
      msKg,
      mtKg,
      totalNitrogenKg,
      requiredAreaHa,
      nTotGL
    };
  }, [targetBiomass, digestate, agronomic, mixture, biomass]);

  // --- Sensitivity Data ---
  const sensitivityBiomass = useMemo(() => {
    const data = [];
    for (let b = 1000; b <= 20000; b += 1000) {
      const tsS = b * biomass.fcr * biomass.sludgeProductionRate;
      const ms = mixture.tsSludge > 0 ? (tsS / (mixture.tsSludge / 100)) : 0;
      const mt = mixture.vsInoculum > 0 ? ms * (1 + (mixture.rRatio * mixture.vsSludge) / mixture.vsInoculum) : 0;
      const n = mt * (results.nTotGL / 1000);
      const area = agronomic.maxNitrogenLoad > 0 ? n / agronomic.maxNitrogenLoad : 0;
      data.push({ x: b, area: parseFloat(area.toFixed(2)) });
    }
    return data;
  }, [biomass, mixture, results.nTotGL, agronomic.maxNitrogenLoad]);

  const sensitivityTS = useMemo(() => {
    const data = [];
    for (let ts = 0.8; ts <= 2.4; ts += 0.1) {
      const vs = ts * 0.75;
      const tsS = targetBiomass * biomass.fcr * biomass.sludgeProductionRate;
      const ms = ts > 0 ? (tsS / (ts / 100)) : 0;
      const mt = mixture.vsInoculum > 0 ? ms * (1 + (mixture.rRatio * vs) / mixture.vsInoculum) : 0;
      const n = mt * (results.nTotGL / 1000);
      const area = agronomic.maxNitrogenLoad > 0 ? n / agronomic.maxNitrogenLoad : 0;
      data.push({ x: ts.toFixed(1), area: parseFloat(area.toFixed(2)) });
    }
    return data;
  }, [targetBiomass, biomass, mixture.vsInoculum, mixture.rRatio, results.nTotGL, agronomic.maxNitrogenLoad]);

  const sensitivityFCR = useMemo(() => {
    const data = [];
    for (let fcr = 0.8; fcr <= 1.25; fcr += 0.05) {
      const tsS = targetBiomass * fcr * biomass.sludgeProductionRate;
      const ms = mixture.tsSludge > 0 ? (tsS / (mixture.tsSludge / 100)) : 0;
      const mt = mixture.vsInoculum > 0 ? ms * (1 + (mixture.rRatio * mixture.vsSludge) / mixture.vsInoculum) : 0;
      const n = mt * (results.nTotGL / 1000);
      const area = agronomic.maxNitrogenLoad > 0 ? n / agronomic.maxNitrogenLoad : 0;
      data.push({ x: fcr.toFixed(2), area: parseFloat(area.toFixed(2)) });
    }
    return data;
  }, [targetBiomass, biomass.sludgeProductionRate, mixture, results.nTotGL, agronomic.maxNitrogenLoad]);

  const handleInputChange = (
    setter: React.Dispatch<React.SetStateAction<any>>, 
    field: string, 
    value: string
  ) => {
    const numValue = parseFloat(value) || 0;
    setter((prev: any) => {
      const newState = { ...prev, [field]: numValue };
      if (field === 'tsSludge') {
        newState.vsSludge = parseFloat((numValue * 0.75).toFixed(2));
      }
      return newState;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-100 p-2 rounded-xl">
            <Map className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">RAS AD-Sludge Land</h1>
            <p className="text-xs text-slate-500 font-medium">Calcolo Superficie di Spandimento Necessaria</p>
          </div>
        </div>
        <div className="hidden md:flex flex-col items-end">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Modalità</span>
          <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5">
            Analisi Territoriale
          </span>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Inputs */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Biomass Input (Main Input) */}
          <section className="glass-card p-5 border-l-4 border-l-emerald-500">
            <div className="flex items-center gap-2 mb-4">
              <Fish className="w-4 h-4 text-emerald-500" />
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Biomassa in Ingresso</h2>
            </div>
            <div>
              <label className="label-text">Biomassa Pesce Totale (kg)</label>
              <input 
                type="number" 
                value={targetBiomass}
                onChange={(e) => setTargetBiomass(parseFloat(e.target.value) || 0)}
                className="input-field text-lg py-3 border-emerald-200 focus:border-emerald-500"
              />
              <p className="mt-2 text-[10px] text-slate-400 italic">Inserisci la biomassa totale allevata per calcolare l'area necessaria.</p>
            </div>
          </section>

          {/* Section 1: Digestato */}
          <section className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Droplets className="w-4 h-4 text-blue-500" />
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Caratteristiche Digestato</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-text">TS (%)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={digestate.tsPercent}
                  onChange={(e) => handleInputChange(setDigestate, 'tsPercent', e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="label-text">N tot (% TS)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={digestate.nTotPercentTS}
                  onChange={(e) => handleInputChange(setDigestate, 'nTotPercentTS', e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
          </section>

          {/* Section 2: Miscela */}
          <section className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Scale className="w-4 h-4 text-orange-500" />
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Bilanciamento Miscela</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="label-text">Rapporto R (I/S su VS)</label>
                <input 
                  type="number" 
                  value={mixture.rRatio}
                  onChange={(e) => handleInputChange(setMixture, 'rRatio', e.target.value)}
                  className="input-field"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-text">VS Inoculo (%)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={mixture.vsInoculum}
                    onChange={(e) => handleInputChange(setMixture, 'vsInoculum', e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label-text">TS Sludge (%)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={mixture.tsSludge}
                    onChange={(e) => handleInputChange(setMixture, 'tsSludge', e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-dashed border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Auto-calcolo VS Sludge (75% TS):</span>
                <span className="ml-2 text-xs font-mono font-bold text-slate-600">{mixture.vsSludge}%</span>
              </div>
            </div>
          </section>

          {/* Section 3: Biomassa Parametri */}
          <section className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-purple-500" />
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Parametri RAS</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-text">P (kg TSs/kg mangime)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={biomass.sludgeProductionRate}
                  onChange={(e) => handleInputChange(setBiomass, 'sludgeProductionRate', e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="label-text">FCR (kg/kg)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={biomass.fcr}
                  onChange={(e) => handleInputChange(setBiomass, 'fcr', e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Area Result Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-emerald-900 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Maximize className="w-32 h-32" />
            </div>
            
            <div className="relative z-10">
              <span className="text-emerald-400 font-bold text-xs uppercase tracking-[0.2em] mb-2 block">Superficie Necessaria</span>
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter mb-2">
                {results.requiredAreaHa.toFixed(2)} <span className="text-2xl font-normal text-emerald-500">ha</span>
              </h2>
              <p className="text-emerald-200/60 text-sm max-w-md">
                Area agricola minima richiesta per assorbire l'azoto prodotto da {targetBiomass.toLocaleString()} kg di biomassa ittica.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10 pt-8 border-t border-white/10">
                <div>
                  <span className="block text-[10px] text-emerald-500 font-bold uppercase mb-1">Azoto Totale</span>
                  <span className="text-lg font-mono font-bold">{results.totalNitrogenKg.toFixed(1)} <span className="text-xs font-normal opacity-50">kg N</span></span>
                </div>
                <div>
                  <span className="block text-[10px] text-emerald-500 font-bold uppercase mb-1">Digestato Tot.</span>
                  <span className="text-lg font-mono font-bold">{(results.mtKg / 1000).toFixed(1)} <span className="text-xs font-normal opacity-50">t</span></span>
                </div>
                <div>
                  <span className="block text-[10px] text-emerald-500 font-bold uppercase mb-1">Massa Fango</span>
                  <span className="text-lg font-mono font-bold">{Math.round(results.msKg).toLocaleString()} <span className="text-xs font-normal opacity-50">kg</span></span>
                </div>
                <div>
                  <span className="block text-[10px] text-emerald-500 font-bold uppercase mb-1">Limite Legge</span>
                  <span className="text-lg font-mono font-bold">{agronomic.maxNitrogenLoad} <span className="text-xs font-normal opacity-50">kg/ha</span></span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Sensibilità Biomassa</h3>
                  <p className="text-xs text-slate-500">Area (ha) vs Biomassa (kg)</p>
                </div>
                <Fish className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sensitivityBiomass}>
                    <defs>
                      <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="x" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                    <Area type="monotone" dataKey="area" stroke="#10b981" fill="url(#colorArea)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Sensibilità TS Sludge</h3>
                  <p className="text-xs text-slate-500">Area (ha) vs TS (0.8% - 2.4%)</p>
                </div>
                <Droplets className="w-4 h-4 text-blue-400" />
              </div>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sensitivityTS}>
                    <defs>
                      <linearGradient id="colorTS" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="x" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                    <Area type="monotone" dataKey="area" stroke="#3b82f6" fill="url(#colorTS)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Sensibilità FCR</h3>
                  <p className="text-xs text-slate-500">Area (ha) vs FCR (0.8 - 1.2)</p>
                </div>
                <Activity className="w-4 h-4 text-purple-400" />
              </div>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sensitivityFCR}>
                    <defs>
                      <linearGradient id="colorFCR" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="x" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                    <Area type="monotone" dataKey="area" stroke="#a855f7" fill="url(#colorFCR)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-card p-6 flex flex-col">
              <div className="flex items-center gap-2 mb-6">
                <Info className="w-4 h-4 text-slate-400" />
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Note Tecniche</h3>
              </div>
              <div className="space-y-4 flex-1">
                <div className="flex gap-3">
                  <div className="w-1 h-auto bg-emerald-500 rounded-full shrink-0" />
                  <p className="text-xs text-slate-600 leading-relaxed">
                    L'area necessaria cresce linearmente con la biomassa ma può essere ottimizzata migliorando la densità del fango.
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="w-1 h-auto bg-blue-500 rounded-full shrink-0" />
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Un <strong>TS Sludge</strong> più elevato riduce il volume totale di digestato e, di conseguenza, la superficie di spandimento richiesta.
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="w-1 h-auto bg-purple-500 rounded-full shrink-0" />
                  <p className="text-xs text-slate-600 leading-relaxed">
                    L'efficienza alimentare (<strong>FCR</strong>) ha un impatto diretto sulla produzione di solidi e sul carico di azoto finale.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 p-6 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold text-slate-900 uppercase tracking-widest">RAS AD-Sludge Land v1.0</span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium">
            © {new Date().getFullYear()} - Strumento di pianificazione territoriale per impianti RAS
          </p>
        </div>
      </footer>
    </div>
  );
}

