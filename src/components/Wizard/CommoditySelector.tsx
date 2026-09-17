import React, { useState, useMemo } from 'react';
import { Search, Sliders, RotateCcw, Droplets, Wind, Activity, Flame, ShieldAlert, Check, Leaf, Box, Package } from 'lucide-react';
import { Commodity, Language } from '../../types';
import { COMMODITIES } from '../../data/commodities';
import { TRANSLATIONS } from '../../i18n/translations';

interface CommoditySelectorProps {
  selectedCommodity: Commodity;
  onSelectCommodity: (commodity: Commodity) => void;
  language: Language;
  onOverrideChange: (updatedCommodity: Commodity) => void;
}

export const CommoditySelector: React.FC<CommoditySelectorProps> = ({
  selectedCommodity,
  onSelectCommodity,
  language,
  onOverrideChange,
}) => {
  const t = TRANSLATIONS[language];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showOverride, setShowOverride] = useState(false);

  const categories = [
    { id: 'all', label: t.allCategories },
    { id: 'produce', label: t.produce },
    { id: 'dairy', label: t.dairy },
    { id: 'spices_dry', label: t.spices_dry },
    { id: 'protein', label: t.protein },
  ];

  const filteredCommodities = useMemo(() => {
    return COMMODITIES.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const handleManualSpecUpdate = (field: keyof Commodity, value: number) => {
    const updated = {
      ...selectedCommodity,
      [field]: value,
    };
    onOverrideChange(updated);
  };

  const handleResetSpecs = () => {
    const original = COMMODITIES.find((c) => c.id === selectedCommodity.id);
    if (original) {
      onOverrideChange({ ...original });
    }
  };

  return (
    <div className="space-y-4">
      {/* Category Pills & Search Box */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-600/20'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Dynamic Search Box */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="commodity-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchCommodityPlaceholder}
            className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-2xs"
          />
        </div>
      </div>

      {/* Commodity Card Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
        {filteredCommodities.map((item) => {
          const isSelected = item.id === selectedCommodity.id;
          return (
            <div
              key={item.id}
              id={`commodity-card-${item.id}`}
              onClick={() => {
                onSelectCommodity(item);
                setShowOverride(false);
              }}
              className={`cursor-pointer rounded-xl p-3 transition-all relative overflow-hidden group flex flex-col justify-between ${
                isSelected
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-2 border-emerald-500 shadow-sm shadow-emerald-500/10'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 hover:bg-slate-50/80 dark:hover:bg-slate-850 shadow-2xs'
              }`}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                  <Check className="w-2.5 h-2.5" />
                </div>
              )}
              <div className="flex items-start space-x-2.5">
                <span className="text-3xl filter drop-shadow group-hover:scale-110 transition-transform mr-1">
                  {item.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                    {item.name}
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 mt-2 text-[10px] text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                <span className="flex items-center text-cyan-700 dark:text-cyan-400 font-semibold">
                  <Droplets className="w-2.5 h-2.5 mr-0.5" />
                  {item.moistureContentPercent}%
                </span>
                {item.respirationRateMgPerKgHr > 0 ? (
                  <span className="flex items-center text-emerald-700 dark:text-emerald-400 font-semibold">
                    <Wind className="w-2.5 h-2.5 mr-0.5" />
                    {item.respirationRateMgPerKgHr}
                  </span>
                ) : (
                  <span className="text-slate-400">Stable gas</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Baseline Biochemical Telemetry Panel */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2.5">
            <span className="text-3xl filter drop-shadow mr-1">{selectedCommodity.icon}</span>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                  {selectedCommodity.name}
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 uppercase tracking-wider">
                  {selectedCommodity.category}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t.biochemicalSpecs}
              </p>
            </div>
          </div>

          <button
            id="toggle-override-specs-btn"
            onClick={() => setShowOverride(!showOverride)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors self-start sm:self-auto"
          >
            <Sliders className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{showOverride ? t.closeOverride : t.overrideSpecs}</span>
          </button>
        </div>

        {/* Telemetry Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          <div className="bg-slate-50 dark:bg-slate-850 rounded-xl p-2.5 border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 text-[11px]">
              <span className="flex items-center font-medium">
                <Droplets className="w-3 h-3 text-cyan-600 dark:text-cyan-400 mr-1" />
                {t.moistureContent}
              </span>
              <span className="text-cyan-700 dark:text-cyan-300 font-bold font-mono">
                {selectedCommodity.moistureContentPercent}%
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-cyan-500 h-1.5 rounded-full"
                style={{ width: `${selectedCommodity.moistureContentPercent}%` }}
              />
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-850 rounded-xl p-2.5 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 text-[11px]">
              <span className="flex items-center font-medium">
                <Wind className="w-3 h-3 text-emerald-600 dark:text-emerald-400 mr-1" />
                {t.respirationRate}
              </span>
              <span className="text-emerald-700 dark:text-emerald-300 font-bold font-mono">
                {selectedCommodity.respirationRateMgPerKgHr}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 font-mono">
              mg CO₂ / kg·hr
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-850 rounded-xl p-2.5 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 text-[11px]">
              <span className="flex items-center font-medium">
                <Flame className="w-3 h-3 text-amber-600 dark:text-amber-400 mr-1" />
                {t.fatContent}
              </span>
              <span className="text-amber-700 dark:text-amber-300 font-bold font-mono">
                {selectedCommodity.fatContentPercent}%
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2">
              Rancidity: <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedCommodity.fatContentPercent > 10 ? 'High' : 'Low'}</span>
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-850 rounded-xl p-2.5 border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 text-[11px]">
              <span className="flex items-center font-medium">
                <Activity className="w-3 h-3 text-rose-600 dark:text-rose-400 mr-1" />
                {t.oxygenSensitivity}
              </span>
              <span className="text-rose-700 dark:text-rose-300 font-bold font-mono">
                {selectedCommodity.oxygenSensitivity}/10
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-rose-500 h-1.5 rounded-full"
                style={{ width: `${selectedCommodity.oxygenSensitivity * 10}%` }}
              />
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-850 rounded-xl p-2.5 border border-slate-200/80 dark:border-slate-800 col-span-2 sm:col-span-1 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 text-[11px]">
              <span className="flex items-center font-medium">
                <ShieldAlert className="w-3 h-3 text-purple-600 dark:text-purple-400 mr-1" />
                Water Activity
              </span>
              <span className="text-purple-700 dark:text-purple-300 font-bold font-mono">
                {selectedCommodity.waterActivityAw}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2">
              Ethylene: <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedCommodity.ethyleneProduction}</span>
            </p>
          </div>
        </div>

        {/* Expandable Manual Spec Override Drawer */}
        {showOverride && (
          <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 -mx-4 -mb-4 p-4 rounded-b-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center">
                <Sliders className="w-3.5 h-3.5 mr-1.5" />
                Lab Spec Calibration (Fine-Tune Biochemical Tolerances)
              </span>
              <button
                onClick={handleResetSpecs}
                className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 flex items-center space-x-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Baseline</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div>
                <div className="flex justify-between text-slate-700 dark:text-slate-300 mb-1 font-medium">
                  <span>Moisture (%):</span>
                  <span className="text-cyan-700 dark:text-cyan-300 font-mono font-bold">{selectedCommodity.moistureContentPercent}%</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="98"
                  step="0.5"
                  value={selectedCommodity.moistureContentPercent}
                  onChange={(e) => handleManualSpecUpdate('moistureContentPercent', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-700 dark:text-slate-300 mb-1 font-medium">
                  <span>Respiration:</span>
                  <span className="text-emerald-700 dark:text-emerald-300 font-mono font-bold">{selectedCommodity.respirationRateMgPerKgHr}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="120"
                  step="1"
                  value={selectedCommodity.respirationRateMgPerKgHr}
                  onChange={(e) => handleManualSpecUpdate('respirationRateMgPerKgHr', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-700 dark:text-slate-300 mb-1 font-medium">
                  <span>Fat Content (%):</span>
                  <span className="text-amber-700 dark:text-amber-300 font-mono font-bold">{selectedCommodity.fatContentPercent}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  step="0.5"
                  value={selectedCommodity.fatContentPercent}
                  onChange={(e) => handleManualSpecUpdate('fatContentPercent', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-700 dark:text-slate-300 mb-1 font-medium">
                  <span>Oxygen Sensitivity:</span>
                  <span className="text-rose-700 dark:text-rose-300 font-mono font-bold">{selectedCommodity.oxygenSensitivity}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.5"
                  value={selectedCommodity.oxygenSensitivity}
                  onChange={(e) => handleManualSpecUpdate('oxygenSensitivity', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
