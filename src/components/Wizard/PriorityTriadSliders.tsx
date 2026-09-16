import React from 'react';
import { DollarSign, Clock, Leaf, Scale } from 'lucide-react';
import { PriorityWeights, Language } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';

interface PriorityTriadSlidersProps {
  weights: PriorityWeights;
  onChange: (updated: PriorityWeights) => void;
  language: Language;
}

export const PriorityTriadSliders: React.FC<PriorityTriadSlidersProps> = ({
  weights,
  onChange,
  language,
}) => {
  const t = TRANSLATIONS[language];

  const handleWeightChange = (key: keyof PriorityWeights, newValue: number) => {
    const clampedNew = Math.max(5, Math.min(90, newValue));
    const otherKeys = (['costWeight', 'shelfLifeWeight', 'ecoWeight'] as (keyof PriorityWeights)[]).filter(
      (k) => k !== key
    );

    const remaining = 100 - clampedNew;
    const currentSumOthers = weights[otherKeys[0]] + weights[otherKeys[1]];

    let newOther1 = 0;
    let newOther2 = 0;

    if (currentSumOthers > 0) {
      newOther1 = Math.round((weights[otherKeys[0]] / currentSumOthers) * remaining);
      newOther2 = remaining - newOther1;
    } else {
      newOther1 = Math.round(remaining / 2);
      newOther2 = remaining - newOther1;
    }

    onChange({
      [key]: clampedNew,
      [otherKeys[0]]: newOther1,
      [otherKeys[1]]: newOther2,
    } as unknown as PriorityWeights);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center">
              {t.priorityWeightsTitle}
              <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-mono font-bold border border-emerald-200 dark:border-emerald-800">
                100% Normalized
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {t.prioritySubtitle}
            </p>
          </div>
        </div>

        {/* Balance Ratio Indicator */}
        <div className="flex items-center space-x-1.5 self-start sm:self-auto text-xs font-mono font-bold bg-slate-50 dark:bg-slate-850 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800">
          <span className="text-amber-600 dark:text-amber-400">{weights.costWeight}%</span>
          <span className="text-slate-400">:</span>
          <span className="text-cyan-600 dark:text-cyan-400">{weights.shelfLifeWeight}%</span>
          <span className="text-slate-400">:</span>
          <span className="text-emerald-600 dark:text-emerald-400">{weights.ecoWeight}%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
        {/* Lowest Cost Slider */}
        <div className="space-y-1.5 bg-amber-50/40 dark:bg-slate-850/60 p-3 rounded-xl border border-amber-200/80 dark:border-slate-800">
          <div className="flex flex-wrap justify-between items-center text-xs gap-2">
            <span className="flex items-center text-amber-800 dark:text-amber-300 font-bold">
              <DollarSign className="w-4 h-4 mr-1 text-amber-600 flex-shrink-0" />
              <span className="truncate">{t.lowestCost}</span>
            </span>
            <span className="font-mono font-bold text-sm text-amber-700 dark:text-amber-400">
              {weights.costWeight}%
            </span>
          </div>
          <input
            id="priority-cost-slider"
            type="range"
            min="5"
            max="90"
            step="1"
            value={weights.costWeight}
            onChange={(e) => handleWeightChange('costWeight', parseFloat(e.target.value))}
            className="w-full accent-amber-500"
          />
          <p className="text-[10px] text-slate-500 dark:text-slate-400">
            Minimizes base resin cost and converter margins.
          </p>
        </div>

        {/* Longest Shelf Life Slider */}
        <div className="space-y-1.5 bg-cyan-50/40 dark:bg-slate-850/60 p-3 rounded-xl border border-cyan-200/80 dark:border-slate-800">
          <div className="flex flex-wrap justify-between items-center text-xs gap-2">
            <span className="flex items-center text-cyan-800 dark:text-cyan-300 font-bold">
              <Clock className="w-4 h-4 mr-1 text-cyan-600 flex-shrink-0" />
              <span className="truncate">{t.longestShelfLife}</span>
            </span>
            <span className="font-mono font-bold text-sm text-cyan-700 dark:text-cyan-400">
              {weights.shelfLifeWeight}%
            </span>
          </div>
          <input
            id="priority-shelflife-slider"
            type="range"
            min="5"
            max="90"
            step="1"
            value={weights.shelfLifeWeight}
            onChange={(e) => handleWeightChange('shelfLifeWeight', parseFloat(e.target.value))}
            className="w-full accent-cyan-500"
          />
          <p className="text-[10px] text-slate-500 dark:text-slate-400">
            Maximizes oxygen (OTR) and moisture (WVTR) gas barriers.
          </p>
        </div>

        {/* Eco-Friendliness Slider */}
        <div className="space-y-1.5 bg-emerald-50/40 dark:bg-slate-850/60 p-3 rounded-xl border border-emerald-200/80 dark:border-slate-800">
          <div className="flex flex-wrap justify-between items-center text-xs gap-2">
            <span className="flex items-center text-emerald-800 dark:text-emerald-300 font-bold min-w-0">
              <Leaf className="w-4 h-4 mr-1 text-emerald-600 flex-shrink-0" />
              <span className="truncate">{t.ecoFriendliness}</span>
            </span>
            <span className="font-mono font-bold text-sm text-emerald-700 dark:text-emerald-400 flex-shrink-0">
              {weights.ecoWeight}%
            </span>
          </div>
          <input
            id="priority-eco-slider"
            type="range"
            min="5"
            max="90"
            step="1"
            value={weights.ecoWeight}
            onChange={(e) => handleWeightChange('ecoWeight', parseFloat(e.target.value))}
            className="w-full accent-emerald-500"
          />
          <p className="text-[10px] text-slate-500 dark:text-slate-400">
            Prioritizes certified bio-polymers and low carbon lifecycle footprints.
          </p>
        </div>
      </div>
    </div>
  );
};
