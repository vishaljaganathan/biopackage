import React, { useState } from 'react';
import { Award, Leaf, DollarSign, CheckCircle2, ShieldCheck, ArrowRight, Info, Layers, Wind, Droplets } from 'lucide-react';
import { MaterialScore, Language } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';

interface MaterialCardProps {
  score: MaterialScore;
  language: Language;
  onSourceMaterial: (materialId: string) => void;
}

export const MaterialCard: React.FC<MaterialCardProps> = ({
  score,
  language,
  onSourceMaterial,
}) => {
  const t = TRANSLATIONS[language];
  const { material } = score;
  const [showTooltip, setShowTooltip] = useState(false);

  const getTierConfig = () => {
    switch (score.tier) {
      case 'tier1_best_overall':
        return {
          title: t.tier1BestOverall,
          icon: Award,
          badgeBg: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 shadow-xs',
          cardBorder: 'glass-card-emerald',
          accentColor: 'text-emerald-700 dark:text-emerald-400',
          buttonClass: 'bg-emerald-600 hover:bg-emerald-700 text-white border-transparent shadow-md shadow-emerald-600/20',
        };
      case 'tier2_most_sustainable':
        return {
          title: t.tier2MostSustainable,
          icon: Leaf,
          badgeBg: 'bg-cyan-100 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 border-cyan-300 dark:border-cyan-700 shadow-xs',
          cardBorder: 'glass-card border-cyan-400 dark:border-cyan-600',
          accentColor: 'text-cyan-700 dark:text-cyan-400',
          buttonClass: 'bg-cyan-50 hover:bg-cyan-100 text-cyan-700 border border-cyan-200 dark:bg-cyan-900/30 dark:hover:bg-cyan-900/50 dark:text-cyan-300 dark:border-cyan-800 shadow-xs',
        };
      case 'tier3_budget_pick':
      default:
        return {
          title: t.tier3BudgetPick,
          icon: DollarSign,
          badgeBg: 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700 shadow-xs',
          cardBorder: 'glass-card border-amber-400 dark:border-amber-600',
          accentColor: 'text-amber-700 dark:text-amber-400',
          buttonClass: 'bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-900/30 dark:hover:bg-amber-900/50 dark:text-amber-300 dark:border-amber-800 shadow-xs',
        };
    }
  };

  const config = getTierConfig();
  const TierIcon = config.icon;

  return (
    <div
      id={`material-card-${material.id}`}
      className={`relative rounded-2xl ${config.cardBorder} p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-lg space-y-5`}
    >
      {/* Top Header & Tier Badge */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-extrabold border ${config.badgeBg}`}
          >
            <TierIcon className="w-3.5 h-3.5 mr-1.5" />
            {config.title}
          </span>
          <div className="flex items-center space-x-1.5 bg-slate-50 dark:bg-slate-850 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Match:</span>
            <span className="font-mono font-extrabold text-sm text-emerald-700 dark:text-emerald-400">
              {score.overallScore}%
            </span>
          </div>
        </div>

        <div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
            {material.name}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center mt-1">
            <Layers className="w-3.5 h-3.5 text-slate-400 mr-1.5 flex-shrink-0" />
            <span className="font-mono">{material.makeup}</span>
          </p>
        </div>

        {/* Shelf Life & Carbon Pill */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="bg-emerald-500/5 dark:bg-emerald-400/5 backdrop-blur-md p-2.5 rounded-xl border border-emerald-500/10 dark:border-emerald-400/10">
            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block">{t.estimatedShelfLife}</span>
            <span className="text-sm font-extrabold text-cyan-800 dark:text-cyan-300 font-mono">
              ~{score.estimatedShelfLifeDays} {t.days}
            </span>
          </div>
          <div className="bg-emerald-500/5 dark:bg-emerald-400/5 backdrop-blur-md p-2.5 rounded-xl border border-emerald-500/10 dark:border-emerald-400/10">
            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block">Carbon Footprint</span>
            <span className="text-sm font-extrabold text-emerald-800 dark:text-emerald-300 font-mono">
              {material.carbonFootprintKgCo2PerKg} kg CO₂/kg
            </span>
          </div>
        </div>

        {/* Barrier & Physical Telemetry Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs pt-1">
          <div className="flex items-center justify-between p-2 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 backdrop-blur-md">
            <span className="text-slate-600 dark:text-slate-400 text-[11px] font-medium flex items-center">
              <Wind className="w-3 h-3 mr-1 text-teal-600 dark:text-teal-400" />
              OTR:
            </span>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
              {material.otr} <span className="text-[9px] text-slate-500">cc/m²</span>
            </span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 backdrop-blur-md">
            <span className="text-slate-600 dark:text-slate-400 text-[11px] font-medium flex items-center">
              <Droplets className="w-3 h-3 mr-1 text-blue-600 dark:text-blue-400" />
              WVTR:
            </span>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
              {material.wvtr} <span className="text-[9px] text-slate-500">g/m²</span>
            </span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 backdrop-blur-md">
            <span className="text-slate-600 dark:text-slate-400 text-[11px] font-medium">Puncture:</span>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
              {material.punctureResistanceN} N
            </span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 backdrop-blur-md">
            <span className="text-slate-600 dark:text-slate-400 text-[11px] font-medium">Base Rate:</span>
            <span className="font-mono font-bold text-amber-700 dark:text-amber-400">
              ₹{material.costPerKgInr}/kg
            </span>
          </div>
        </div>

        {/* Highlight Bullet Points */}
        <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300 pt-1">
          {material.highlightFeatures.slice(0, 2).map((feat, idx) => (
            <li key={idx} className="flex items-start space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
              <span className="line-clamp-1">{feat}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom Compliance Badge & Action Trigger */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
        {/* FSSAI & BIS Regulatory Compliance Tooltip */}
        <div className="relative">
          <div
            className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-300 cursor-pointer hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onClick={() => setShowTooltip(!showTooltip)}
          >
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="font-bold">{t.fssaiCompliance}</span>
            </div>
            <Info className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          </div>

          {/* Floating Tooltip */}
          {showTooltip && (
            <div className="absolute bottom-full left-0 mb-2 w-full p-3 rounded-xl bg-white dark:bg-slate-900 border border-emerald-500/50 text-[11px] text-slate-700 dark:text-slate-200 shadow-xl z-20 animate-in fade-in zoom-in-95 duration-150">
              <p className="font-extrabold text-emerald-700 dark:text-emerald-400 flex items-center mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                IS 9845 & BIS Certified
              </p>
              <p className="text-slate-600 dark:text-slate-300 text-[10px] leading-relaxed">
                {material.fssaiCompliance.notes}
              </p>
              <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between text-[10px] text-slate-500 dark:text-slate-400">
                <span>Migration: Pass (&lt;10mg/dm²)</span>
                <span>CPCB PWM 2022: Compliant</span>
              </div>
            </div>
          )}
        </div>

        {/* Source Material & Vendor Drawer Trigger */}
        <button
          id={`source-material-btn-${material.id}`}
          onClick={() => onSourceMaterial(material.id)}
          className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all active:scale-[0.99] ${config.buttonClass}`}
        >
          <span>{t.sourceMaterial}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
