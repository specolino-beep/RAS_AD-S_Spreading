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
  AlertCircle
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
  CalculationResults 
} from './types';

export default function AppSpreading() {
  // --- State for Inputs ---
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
    vsSludge: 0.9
  });

  const [biomass, setBiomass] = useState<BiomassParams>({
    sludgeProductionRate: 0.12,
    fcr: 1.1
  });

  // --- Calculations ---
  const results = useMemo((): CalculationResults => {
    const tsGL = digestate.tsPercent * 10;
    const nTotGL = (tsGL * digestate.nTotPercentTS) / 100;
    const mtTons = nTotGL > 0 ? agronomic.maxNitrogenLoad / nTotGL : 0;
    const minInterventions = agronomic.singleInterventionLoad > 0 ? mtTons / agronomic.singleInterventionLoad : 0;
    const mtKg = mtTons * 1000;
    const msKg = mixture.vsInoculum > 0 
      ? mtKg / (1 + (mixture.rRatio * mixture.vsSludge) / mixture.vsInoculum)
      : 0;
    const miKg = mtKg - msKg;
    const totalTsSludge = (msKg * mixture.tsSludge) / 100;
    const totalBiomass = (biomass.sludgeProductionRate > 0 && biomass.fcr > 0)
      ? (totalTsSludge / biomass.sludgeProductionRate) / biomass.fcr
      : 0;

    return { tsGL, nTotGL, mtTons, minInterventions, msKg, miKg, totalBiomass };
  }, [digestate, agronomic, mixture, biomass]);

  // --- Sensitivity Data for Charts ---
  const sensitivityR = useMemo(() => {
    const data = [];
    for (let r = 1; r <= 20; r++) {
      const mtKg = results.mtTons * 1000;
      const ms = mixture.vsInoculum > 0 ? mtKg / (1 + (r * mixture.vsSludge) / mixture.vsInoculum) : 0;
      const tsS = (ms * mixture.tsSludge) / 100;
      const b = (biomass.sludgeProductionRate > 0 && biomass.fcr > 0) ? (tsS / biomass.sludgeProductionRate) / biomass.fcr : 0;
      data.push({ x: r, biomass: Math.round(b) });
    }
    return data;
  }, [results.mtTons, mixture, biomass]);

  const sensitivityTS = useMemo(() => {
    const data = [];
    for (let ts = 0.8; ts <= 2.4; ts += 0.1) {
      const vs = ts * 0.75;
      const mtKg = results.mtTons * 1000;
      const ms = mixture.vsInoculum > 0 ? mtKg / (1 + (mixture.rRatio * vs) / mixture.vsInoculum) : 0;
      const tsS = (ms * ts) / 100;
      const b = (biomass.sludgeProductionRate > 0 && biomass.fcr > 0) ? (tsS / biomass.sludgeProductionRate) / biomass.fcr : 0;
      data.push({ x: ts.toFixed(1), biomass: Math.round(b) });
    }
    return data;
  }, [results.mtTons, mixture, biomass]);

  const sensitivityFCR = useMemo(() => {
    const data = [];
    for (let fcr = 0.8; fcr <= 1.25; fcr += 0.05) {
      const mtKg = results.mtTons * 1000;
      const ms = mixture.vsInoculum > 0 ? mtKg / (1 + (mixture.rRatio * mixture.vsSludge) / mixture.vsInoculum) : 0;
      const tsS = (ms * mixture.tsSludge) / 100;
      const b = (biomass.sludgeProductionRate > 0 && fcr > 0) ? (tsS / biomass.sludgeProductionRate) / fcr : 0;
      data.push({ x: fcr.toFixed(2), biomass: Math.round(b) });
    }
    return data;
  }, [results.mtTons, mixture, biomass]);

  const handleInputChange = (setter: any, field: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setter((prev: any) => {
      const newState = { ...prev, [field]: numValue };
      if (field === 'tsSludge') newState.vsSludge = parseFloat((numValue * 0.75).toFixed(2));
      return newState;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-100 p-2 rounded-xl"><Fish className="w-6 h-6 text-emerald-600" /></div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">RAS AD-Sludge Biomass</h1>
            <p className="text-xs text-slate-500 font-medium">Modello di Calcolo Sostenibilità RAS</p>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-6">
          <section className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4"><Droplets className="w-4 h-4 text-blue-500" /><h2 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Caratteristiche Digestato</h2></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="label-text">TS (%)</label><input type="number" step="0.1" value={digestate.tsPercent} onChange={(e) => handleInputChange(setDigestate, 'tsPercent', e.target.value)} className="input-field" /></div>
              <div><label className="label-text">N tot (% TS)</label><input type="number" step="0.1" value={digestate.nTotPercentTS} onChange={(e) => handleInputChange(setDigestate, 'nTotPercentTS', e.target.value)} className="input-field" /></div>
            </div>
          </section>

          <section className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4"><Leaf className="w-4 h-4 text-emerald-500" /><h2 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Utilizzo Agronomico</h2></div>
            <div className="space-y-4">
              <div><label className="label-text">Carico Max Azoto (kg N/ha/anno)</label><input type="number" value={agronomic.maxNitrogenLoad} onChange={(e) => handleInputChange(setAgronomic, 'maxNitrogenLoad', e.target.value)} className="input-field" /></div>
              <div><label className="label-text">Spandimento Singolo (t/ha)</label><input type="number" value={agronomic.singleInterventionLoad} onChange={(e) => handleInputChange(setAgronomic, 'singleInterventionLoad', e.target.value)} className="input-field" /></div>
            </div>
          </section>

          <section className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4"><Scale className="w-4 h-4 text-orange-500" /><h2 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Bilanciamento Miscela</h2></div>
            <div className="space-y-4">
              <div><label className="label-text">Rapporto R (I/S su VS)</label><input type="number" value={mixture.rRatio} onChange={(e) => handleInputChange(setMixture, 'rRatio', e.target.value)} className="input-field" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label-text">VS Inoculo (%)</label><input type="number" step="0.1" value={mixture.vsInoculum} onChange={(e) => handleInputChange(setMixture, 'vsInoculum', e.target.value)} className="input-field" /></div>
                <div><label className="label-text">VS Sludge (%)</label><input type="number" step="0.1" value={mixture.vsSludge} onChange={(e) => handleInputChange(setMixture, 'vsSludge', e.target.value)} className="input-field" /></div>
              </div>
              <div><label className="label-text">TS Sludge (%)</label><input type="number" step="0.1" value={mixture.tsSludge} onChange={(e) => handleInputChange(setMixture, 'tsSludge', e.target.value)} className="input-field" /></div>
            </div>
          </section>

          <section className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4"><Activity className="w-4 h-4 text-purple-500" /><h2 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Parametri Biomassa</h2></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="label-text">P (kg TSs/kg mangime)</label><input type="number" step="0.01" value={biomass.sludgeProductionRate} onChange={(e) => handleInputChange(setBiomass, 'sludgeProductionRate', e.target.value)} className="input-field" /></div>
              <div><label className="label-text">FCR (kg/kg)</label><input type="number" step="0.1" value={biomass.fcr} onChange={(e) => handleInputChange(setBiomass, 'fcr', e.target.value)} className="input-field" /></div>
            </div>
          </section>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-slate-950 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden border border-white/10"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10"><Fish className="w-32 h-32" /></div>
            <div className="relative z-10">
              <span className="text-emerald-400 font-bold text-xs uppercase tracking-[0.2em] mb-2 block">Risultato Principale</span>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-2 text-white">
                {Math.round(results.totalBiomass).toLocaleString()} <span className="text-xl font-normal text-slate-400">kg/ha/anno</span>
              </h2>
              <p className="text-slate-300 text-sm max-w-md">Biomassa ittica massima gestibile rispettando il limite di {agronomic.maxNitrogenLoad} kg N/ha/anno.</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10 pt-8 border-t border-white/10">
                <div><span className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Digestato Tot.</span><span className="text-lg font-mono font-bold text-white">{results.mtTons.toFixed(1)} t</span></div>
                <div><span className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Massa Fango</span><span className="text-lg font-mono font-bold text-white">{Math.round(results.msKg).toLocaleString()} kg</span></div>
                <div><span className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Interventi</span><span className="text-lg font-mono font-bold text-white">{results.minInterventions.toFixed(1)}</span></div>
                <div><span className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Massa Inoculo</span><span className="text-lg font-mono font-bold text-white">{Math.round(results.miKg).toLocaleString()} kg</span></div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6">
              <h3 className="text-sm font-bold text-slate-800 mb-6">Sensibilità Rapporto R</h3>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sensitivityR}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="x" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                    <Tooltip />
                    <Area type="monotone" dataKey="biomass" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-sm font-bold text-slate-800 mb-6">Sensibilità TS Sludge</h3>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sensitivityTS}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="x" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                    <Tooltip />
                    <Area type="monotone" dataKey="biomass" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-sm font-bold text-slate-800 mb-6">Sensibilità FCR</h3>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sensitivityFCR}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="x" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                    <Tooltip />
                    <Area type="monotone" dataKey="biomass" stroke="#a855f7" fill="#a855f7" fillOpacity={0.1} strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-card p-6 flex flex-col">
              <div className="flex items-center gap-2 mb-6"><Info className="w-4 h-4 text-slate-400" /><h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Note Tecniche</h3></div>
              <div className="space-y-4 flex-1">
                <p className="text-xs text-slate-600 leading-relaxed">La riduzione del rapporto <strong>R</strong> ottimizza la sostenibilità. Il limite è fissato a 170 kg N/ha/anno (ZVN).</p>
                <p className="text-xs text-slate-600 leading-relaxed">I parametri <strong>P</strong> e <strong>FCR</strong> sono determinanti per la conversione dei solidi in biomassa.</p>
              </div>
              <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-slate-400" /><p className="text-[10px] text-slate-500 font-medium">Assicurarsi che i dati derivino da test certificati.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 p-6 mt-12">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-widest">RAS AD-Sludge Biomass v1.0</span>
          <p className="text-[10px] text-slate-400 font-medium">© {new Date().getFullYear()} - Strumento professionale</p>
        </div>
      </footer>
    </div>
  );
}
