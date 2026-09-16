import React, { useState, useMemo, useEffect } from 'react';
import {
  Sparkles,
  Layers,
  Activity,
  Truck,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sliders,
  BarChart3,
  HelpCircle,
  Clock,
  Droplets,
  Wind
} from 'lucide-react';
import { Commodity, PriorityWeights, TransitClimateConfig, Language, MaterialScore } from './types';
import { COMMODITIES } from './data/commodities';
import { MATERIALS } from './data/materials';
import { rankMaterials } from './utils/recommendationEngine';
import { Header } from './components/Header';
import { CommoditySelector } from './components/Wizard/CommoditySelector';
import { ClimateTransitSliders } from './components/Wizard/ClimateTransitSliders';
import { PriorityTriadSliders } from './components/Wizard/PriorityTriadSliders';
import { MaterialCard } from './components/Recommendation/MaterialCard';
import { BarrierRadarChart } from './components/Recommendation/BarrierRadarChart';
import { ShelfLifeSimulator } from './components/Simulator/ShelfLifeSimulator';
import { VendorDrawer } from './components/Procurement/VendorDrawer';
import { PrintableDossierModal } from './components/Dossier/PrintableDossierModal';
import { TRANSLATIONS } from './i18n/translations';
import { persistSimulation } from './services/firebase';

export function App() {
  // Theme State: Default to Light Theme
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [isDark]);

  // App State
  const [language, setLanguage] = useState<Language>('en');
  const [activeStep, setActiveStep] = useState<number>(1);
  const [selectedCommodity, setSelectedCommodity] = useState<Commodity>(COMMODITIES[0]);

  // Transit & Climate Config
  const [transit, setTransit] = useState<TransitClimateConfig>({
    temperatureC: 12.0,
    relativeHumidityPercent: 85,
    coldChainAvailable: true,
    transitDays: 14,
  });

  // Priority Weights (Normalized to 100%)
  const [priorityWeights, setPriorityWeights] = useState<PriorityWeights>({
    costWeight: 25,
    shelfLifeWeight: 45,
    ecoWeight: 30,
  });

  // Drawer and Modal States
  const [isVendorDrawerOpen, setIsVendorDrawerOpen] = useState<boolean>(false);
  const [selectedMaterialIdForDrawer, setSelectedMaterialIdForDrawer] = useState<string>(MATERIALS[0].id);
  const [isDossierOpen, setIsDossierOpen] = useState<boolean>(false);
  const [showSpecComparison, setShowSpecComparison] = useState<boolean>(true);

  const t = TRANSLATIONS[language];

  // Dynamically calculate recommendation scores
  const rankedScores: MaterialScore[] = useMemo(() => {
    return rankMaterials(selectedCommodity, transit, priorityWeights);
  }, [selectedCommodity, transit, priorityWeights]);

  const topThreeScores = useMemo(() => {
    const tier1 = rankedScores.find(s => s.tier === 'tier1_best_overall') || rankedScores[0];
    const tier2 = rankedScores.find(s => s.tier === 'tier2_most_sustainable') || rankedScores[1];
    const tier3 = rankedScores.find(s => s.tier === 'tier3_budget_pick') || rankedScores[2];
    // In case there are not enough distinct materials, fallback to just slicing
    if (!tier1 || !tier2 || !tier3) return rankedScores.slice(0, 3);
    return [tier1, tier2, tier3];
  }, [rankedScores]);

  const tier1Score = topThreeScores[0] || {
    material: MATERIALS[0],
    overallScore: 90,
    barrierFitScore: 90,
    shelfLifeScore: 90,
    costScore: 90,
    ecoScore: 90,
    estimatedShelfLifeDays: 20,
    tier: 'tier1_best_overall',
  };

  const drawerMaterial = useMemo(() => {
    return MATERIALS.find((m) => m.id === selectedMaterialIdForDrawer) || tier1Score.material;
  }, [selectedMaterialIdForDrawer, tier1Score]);

  // Presets Handler
  const handleSelectPreset = (presetKey: 'mango' | 'paneer' | 'spices' | 'strawberries') => {
    switch (presetKey) {
      case 'mango':
        setSelectedCommodity(COMMODITIES.find((c) => c.id === 'mango_alphonso') || COMMODITIES[0]);
        setTransit({
          temperatureC: 12.0,
          relativeHumidityPercent: 88,
          coldChainAvailable: true,
          transitDays: 18,
        });
        setPriorityWeights({ costWeight: 20, shelfLifeWeight: 45, ecoWeight: 35 });
        break;
      case 'paneer':
        setSelectedCommodity(COMMODITIES.find((c) => c.id === 'paneer_artisan') || COMMODITIES[1]);
        setTransit({
          temperatureC: 4.0,
          relativeHumidityPercent: 90,
          coldChainAvailable: true,
          transitDays: 10,
        });
        setPriorityWeights({ costWeight: 20, shelfLifeWeight: 60, ecoWeight: 20 });
        break;
      case 'spices':
        setSelectedCommodity(COMMODITIES.find((c) => c.id === 'spices_malabar') || COMMODITIES[2]);
        setTransit({
          temperatureC: 30.0,
          relativeHumidityPercent: 78,
          coldChainAvailable: false,
          transitDays: 45,
        });
        setPriorityWeights({ costWeight: 35, shelfLifeWeight: 45, ecoWeight: 20 });
        break;
      case 'strawberries':
        setSelectedCommodity(COMMODITIES.find((c) => c.id === 'strawberries_mahabaleshwar') || COMMODITIES[3]);
        setTransit({
          temperatureC: 2.0,
          relativeHumidityPercent: 92,
          coldChainAvailable: true,
          transitDays: 7,
        });
        setPriorityWeights({ costWeight: 15, shelfLifeWeight: 55, ecoWeight: 30 });
        break;
    }
  };

  const handleSourceMaterial = (materialId: string) => {
    setSelectedMaterialIdForDrawer(materialId);
    setIsVendorDrawerOpen(true);
  };

  const handleStepChange = (step: number) => {
    setActiveStep(step);
    persistSimulation({
      commodityId: selectedCommodity.id,
      commodityName: selectedCommodity.name,
      tempC: transit.temperatureC,
      rhPercent: transit.relativeHumidityPercent,
      coldChain: transit.coldChainAvailable,
      priorityWeights: {
        cost: priorityWeights.costWeight,
        shelfLife: priorityWeights.shelfLifeWeight,
        eco: priorityWeights.ecoWeight,
      },
      recommendedMaterial: tier1Score.material.name,
      daysToSpoilage: tier1Score.estimatedShelfLifeDays,
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-emerald-500/20 selection:text-emerald-800 transition-colors duration-300">
      {/* Navigation Header */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        onSelectPreset={handleSelectPreset}
        onOpenDossier={() => setIsDossierOpen(true)}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-6">
        {/* Stepped Progress Navigation Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-white dark:bg-slate-900/80 p-1.5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs backdrop-blur-xl">
          <button
            id="nav-step-1"
            onClick={() => handleStepChange(1)}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
              activeStep === 1
                ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="truncate">{t.step1Title}</span>
          </button>

          <button
            id="nav-step-2"
            onClick={() => handleStepChange(2)}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
              activeStep === 2
                ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="truncate">{t.step2Title}</span>
          </button>

          <button
            id="nav-step-3"
            onClick={() => handleStepChange(3)}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
              activeStep === 3
                ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span className="truncate">{t.step3Title}</span>
          </button>

          <button
            id="nav-step-4"
            onClick={() => {
              handleStepChange(4);
              setIsVendorDrawerOpen(true);
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
              activeStep === 4
                ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span className="truncate">{t.step4Title}</span>
          </button>
        </div>

        {/* Live Simulation Quick-Status Capsule for Steps 2 & 3 */}
        {activeStep > 1 && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-3">
              <span className="text-xl">{selectedCommodity.icon}</span>
              <div>
                <span className="font-extrabold text-slate-900 dark:text-slate-100">
                  {selectedCommodity.name}
                </span>
                <span className="text-slate-400 mx-2">•</span>
                <span className="text-slate-600 dark:text-slate-400">
                  {transit.temperatureC}°C, {transit.relativeHumidityPercent}% RH
                </span>
                <span className="text-slate-400 mx-2">•</span>
                <span className={`font-semibold ${transit.coldChainAvailable ? 'text-cyan-600 dark:text-cyan-400' : 'text-amber-600 dark:text-amber-400'}`}>
                  {transit.coldChainAvailable ? 'Cold Chain Active' : 'Ambient Transit'}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <span className="text-slate-500">Top Match:</span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200">
                {tier1Score.material.name} ({tier1Score.overallScore}%)
              </span>
              <button
                onClick={() => handleStepChange(1)}
                className="text-xs text-slate-500 hover:text-slate-900 font-medium underline underline-offset-2"
              >
                Change Commodity
              </button>
            </div>
          </div>
        )}

        {/* STEP 1: GUIDED SMART INPUT WIZARD (CLEAN TWO-COLUMN COCKPIT LAYOUT) */}
        {activeStep === 1 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Commodity Picker & Baseline Specs (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <CommoditySelector
                  selectedCommodity={selectedCommodity}
                  onSelectCommodity={setSelectedCommodity}
                  language={language}
                  onOverrideChange={setSelectedCommodity}
                />
              </div>

              {/* Right Column: Climate Controls & Priority Triad (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                <ClimateTransitSliders
                  transit={transit}
                  onChange={setTransit}
                  language={language}
                />

                <PriorityTriadSliders
                  weights={priorityWeights}
                  onChange={setPriorityWeights}
                  language={language}
                />

                {/* Forward Action Button */}
                <button
                  id="next-step-to-recommendations-btn"
                  onClick={() => handleStepChange(2)}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs flex items-center justify-center space-x-2 shadow-md shadow-emerald-600/20 active:scale-[0.99] transition-all"
                >
                  <span>Proceed to Packaging Recommendations</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: RECOMMENDATION MATRIX & COMPARATIVE CARDS */}
        {activeStep === 2 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 flex items-center">
                  <Sparkles className="w-5 h-5 text-emerald-600 mr-2" />
                  {t.recMatrixTitle}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t.recMatrixSubtitle} for <strong className="text-emerald-700 dark:text-emerald-400">{selectedCommodity.name}</strong>
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowSpecComparison(!showSpecComparison)}
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-100 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 text-xs font-semibold flex items-center space-x-1.5 shadow-2xs"
                >
                  <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{showSpecComparison ? 'Hide Side-by-Side Matrix' : 'Compare All Specs'}</span>
                </button>
                <button
                  onClick={() => handleStepChange(3)}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center space-x-1 shadow-xs"
                >
                  <span>Simulate Shelf Life</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 3 Ranked Tier Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {topThreeScores.map((score) => (
                <MaterialCard
                  key={score.material.id}
                  score={score}
                  language={language}
                  onSourceMaterial={handleSourceMaterial}
                />
              ))}
            </div>

            {/* Side-by-Side Spec Comparison Matrix Table */}
            {showSpecComparison && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center">
                    <BarChart3 className="w-4 h-4 text-emerald-600 mr-1.5" />
                    Multi-Property Barrier & Regulatory Side-by-Side Comparison
                  </h3>
                  <span className="text-[10px] text-slate-400">
                    Complies with FSSAI Food Safety and Standards (Packaging) Regulations
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold text-[11px]">
                        <th className="py-2.5 px-3">Property / Metric</th>
                        {topThreeScores.map((score, idx) => (
                          <th key={idx} className="py-2.5 px-3">
                            <span className="block text-slate-900 dark:text-slate-100">{score.material.name}</span>
                            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono font-semibold">
                              {score.tier === 'tier1_best_overall' ? 'Best Overall' : score.tier === 'tier2_most_sustainable' ? 'Most Sustainable' : 'Budget Pick'}
                            </span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                      <tr>
                        <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100">Oxygen Barrier (OTR)</td>
                        {topThreeScores.map((s, idx) => (
                          <td key={idx} className="py-2.5 px-3 font-mono font-bold text-teal-700 dark:text-teal-300">
                            {s.material.otr} cc/m²·day
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100">Moisture Barrier (WVTR)</td>
                        {topThreeScores.map((s, idx) => (
                          <td key={idx} className="py-2.5 px-3 font-mono font-bold text-blue-700 dark:text-blue-300">
                            {s.material.wvtr} g/m²·day
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100">Puncture Resistance</td>
                        {topThreeScores.map((s, idx) => (
                          <td key={idx} className="py-2.5 px-3 font-mono">
                            {s.material.punctureResistanceN} N
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100">Base Cost per kg</td>
                        {topThreeScores.map((s, idx) => (
                          <td key={idx} className="py-2.5 px-3 font-mono font-bold text-amber-700 dark:text-amber-400">
                            ₹{s.material.costPerKgInr} / kg
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100">Bio-based Carbon %</td>
                        {topThreeScores.map((s, idx) => (
                          <td key={idx} className="py-2.5 px-3 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                            {s.material.bioBasedPercent}%
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100">FSSAI IS 9845 Migration Pass</td>
                        {topThreeScores.map((s, idx) => (
                          <td key={idx} className="py-2.5 px-3">
                            <div className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center">
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                              <span>Pass (&lt;10mg/dm²)</span>
                            </div>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Live Barrier Radar Envelope Chart */}
            <BarrierRadarChart topScores={topThreeScores} language={language} />
          </div>
        )}

        {/* STEP 3: WHAT-IF SHELF LIFE SIMULATOR */}
        {activeStep === 3 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 flex items-center">
                  <Activity className="w-5 h-5 text-cyan-600 mr-2" />
                  {t.simulatorTitle}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Arrhenius thermal degradation dynamics for <strong className="text-emerald-700 dark:text-emerald-400">{selectedCommodity.name}</strong>
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleStepChange(2)}
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-100 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 text-xs font-semibold flex items-center space-x-1 shadow-2xs"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>View Material Cards</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedMaterialIdForDrawer(tier1Score.material.id);
                    setIsVendorDrawerOpen(true);
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-xs"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Source This Packaging</span>
                </button>
              </div>
            </div>

            {/* Dynamic Simulator & Stress Test Scrub Bar */}
            <ShelfLifeSimulator
              commodity={selectedCommodity}
              selectedMaterial={tier1Score.material}
              baseTransit={transit}
              language={language}
            />

            {/* Biochemical Insights Summary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                  Optimal Shelf Window
                </span>
                <p className="text-lg font-mono font-extrabold text-emerald-700 dark:text-emerald-400">
                  {tier1Score.estimatedShelfLifeDays} Days
                </p>
                <p className="text-[10px] text-slate-500">
                  Maintains &gt;{selectedCommodity.qualityCutoffScore}% sensory score before active senescence.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center">
                  <Droplets className="w-3.5 h-3.5 mr-1 text-cyan-600" />
                  Moisture Vapor Resistance
                </span>
                <p className="text-lg font-mono font-extrabold text-cyan-700 dark:text-cyan-400">
                  {tier1Score.material.wvtr} g/m²·day
                </p>
                <p className="text-[10px] text-slate-500">
                  Prevents transpirational weight loss and moisture caking.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center">
                  <Wind className="w-3.5 h-3.5 mr-1 text-teal-600" />
                  Oxygen Transmission Barrier
                </span>
                <p className="text-lg font-mono font-extrabold text-teal-700 dark:text-teal-400">
                  {tier1Score.material.otr} cc/m²·day
                </p>
                <p className="text-[10px] text-slate-500">
                  Inhibits lipid oxidation, off-flavors, and aerobic mold growth.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: PROCUREMENT OVERVIEW */}
        {activeStep === 4 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-4 max-w-2xl mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 mx-auto flex items-center justify-center">
                <Truck className="w-7 h-7" />
              </div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                {t.vendorDrawerTitle}
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Connect directly with verified Indian biopolymer compounders and co-extrusion converters. Calculate real-time batch pricing, verify MOQs, and issue formal RFQ dossiers.
              </p>
              <button
                id="open-vendor-panel-hero-btn"
                onClick={() => setIsVendorDrawerOpen(true)}
                className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20"
              >
                Open Procurement & Supplier Panel
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Slide-Over Indian Vendor Drawer */}
      <VendorDrawer
        isOpen={isVendorDrawerOpen}
        onClose={() => setIsVendorDrawerOpen(false)}
        material={drawerMaterial}
        language={language}
      />

      {/* Printable Technical Bio-Dossier Modal */}
      <PrintableDossierModal
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
        commodity={selectedCommodity}
        topScore={tier1Score}
        transit={transit}
        language={language}
      />

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950/80 py-4 text-center text-xs text-slate-500 dark:text-slate-400">
        <p>
          BioPack AI • Built for Smart India Hackathon (SIH 2026) • Sustainable Packaging Intelligence Engine
        </p>
      </footer>
    </div>
  );
}

export default App;
