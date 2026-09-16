import React, { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { Activity, AlertTriangle, CheckCircle2, Sliders } from 'lucide-react';
import { Commodity, MaterialSpec, TransitClimateConfig, Language } from '../../types';
import { simulateShelfLife } from '../../utils/simulationEngine';
import { TRANSLATIONS } from '../../i18n/translations';

interface ShelfLifeSimulatorProps {
  commodity: Commodity;
  selectedMaterial: MaterialSpec;
  baseTransit: TransitClimateConfig;
  language: Language;
}

export const ShelfLifeSimulator: React.FC<ShelfLifeSimulatorProps> = ({
  commodity,
  selectedMaterial,
  baseTransit,
  language,
}) => {
  const t = TRANSLATIONS[language];

  const [scrubTemp, setScrubTemp] = useState(baseTransit.temperatureC);
  const [scrubRh, setScrubRh] = useState(baseTransit.relativeHumidityPercent);

  const simulationResult = useMemo(() => {
    const stressConfig: TransitClimateConfig = {
      ...baseTransit,
      temperatureC: scrubTemp,
      relativeHumidityPercent: scrubRh,
    };
    return simulateShelfLife(commodity, selectedMaterial, stressConfig, 50);
  }, [commodity, selectedMaterial, baseTransit, scrubTemp, scrubRh]);

  const { timeline, daysToSpoilage, primarySpoilageVector, spoilageReason } = simulationResult;
  const isTransitSafe = daysToSpoilage >= baseTransit.transitDays;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex flex-wrap items-center">
              <span className="mr-2">{t.simulatorTitle}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 font-bold border border-cyan-200 dark:border-cyan-800">
                {selectedMaterial.name}
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {t.simulatorSubtitle}
            </p>
          </div>
        </div>

        {/* Live Breakpoint Counter Badge */}
        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <div className="bg-slate-50 dark:bg-slate-850 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center space-x-2">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">{t.spoilageBreakpoint}:</span>
            <span className="font-mono font-extrabold text-sm text-emerald-700 dark:text-emerald-400">
              Day {daysToSpoilage}
            </span>
          </div>
        </div>
      </div>

      {/* Stress-Test Climate Scrub Bar */}
      <div className="bg-slate-50 dark:bg-slate-850/60 rounded-xl p-3.5 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 flex items-center">
            <Sliders className="w-3.5 h-3.5 mr-1.5" />
            {t.stressTestScrubber}
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">
            Simulate ambient heat spikes or humidity variations during shipping
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <div className="flex justify-between text-slate-700 dark:text-slate-300 mb-1 font-semibold">
              <span>{t.scrubTemp}:</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-mono font-bold">{scrubTemp}°C</span>
            </div>
            <input
              id="stress-scrub-temp"
              type="range"
              min="-5"
              max="45"
              step="1"
              value={scrubTemp}
              onChange={(e) => setScrubTemp(parseFloat(e.target.value))}
              className="w-full accent-emerald-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-700 dark:text-slate-300 mb-1 font-semibold">
              <span>{t.scrubRh}:</span>
              <span className="text-cyan-700 dark:text-cyan-400 font-mono font-bold">{scrubRh}% RH</span>
            </div>
            <input
              id="stress-scrub-rh"
              type="range"
              min="20"
              max="95"
              step="1"
              value={scrubRh}
              onChange={(e) => setScrubRh(parseFloat(e.target.value))}
              className="w-full accent-cyan-600"
            />
          </div>
        </div>
      </div>

      {/* Safety Margin Alert Banner */}
      <div
        className={`p-3.5 rounded-xl border flex items-start space-x-3 text-xs ${
          isTransitSafe
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200'
            : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-700 text-rose-900 dark:text-rose-200'
        }`}
      >
        {isTransitSafe ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
        ) : (
          <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
        )}
        <div className="space-y-1">
          <div className="font-extrabold flex items-center">
            {isTransitSafe ? (
              <span>{t.safeZone}: Freshness preserved beyond transit requirement ({baseTransit.transitDays} {t.days})</span>
            ) : (
              <span>{t.riskZone}: Spoilage threshold crossed on Day {daysToSpoilage} prior to transit end ({baseTransit.transitDays} {t.days})</span>
            )}
          </div>
          <p className="text-[11px] leading-relaxed opacity-90">
            {isTransitSafe
              ? `Quality remains above the critical ${commodity.qualityCutoffScore}% standard for ${daysToSpoilage} days at ${scrubTemp}°C and ${scrubRh}% RH.`
              : `Primary Degradation Vector: ${primarySpoilageVector}. ${spoilageReason}. Consider activating Cold Chain or selecting high-barrier multi-layer film.`}
          </p>
        </div>
      </div>

      {/* Dynamic Degradation Area Chart */}
      <div className="w-full h-72 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={timeline} margin={{ top: 25, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="qualityGradientLight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="microbialGradientLight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0891b2" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0891b2" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="day"
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              tickFormatter={(val) => `Day ${val}`}
            />
            <YAxis stroke="#64748b" fontSize={10} domain={[0, 100]} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                borderColor: '#cbd5e1',
                borderRadius: '0.75rem',
                fontSize: '11px',
                color: '#0f172a',
                boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
              }}
              formatter={(value: any, name: any) => [`${value}%`, name]}
              labelFormatter={(label) => `Day ${label}`}
            />
            <ReferenceLine
              y={commodity.qualityCutoffScore}
              stroke="#e11d48"
              strokeDasharray="4 4"
              label={{
                value: `Cutoff (${commodity.qualityCutoffScore}%)`,
                fill: '#e11d48',
                fontSize: 10,
                position: 'insideBottomRight',
              }}
            />
            <ReferenceLine
              x={daysToSpoilage}
              stroke="#059669"
              strokeDasharray="3 3"
              label={{
                value: `Day ${daysToSpoilage}`,
                fill: '#059669',
                fontSize: 10,
                position: 'top',
              }}
            />
            <Area
              type="monotone"
              dataKey="qualityScore"
              name={t.overallQuality}
              stroke="#059669"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#qualityGradientLight)"
            />
            <Area
              type="monotone"
              dataKey="microbialQuality"
              name={t.microbialMargin}
              stroke="#0891b2"
              strokeWidth={1.5}
              fillOpacity={1}
              fill="url(#microbialGradientLight)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
        <div className="flex items-center space-x-4 font-medium">
          <span className="flex items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 mr-1.5" />
            {t.overallQuality}
          </span>
          <span className="flex items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-600 mr-1.5" />
            {t.microbialMargin}
          </span>
          <span className="flex items-center">
            <span className="w-2.5 h-0.5 bg-rose-600 mr-1.5" />
            Cutoff ({commodity.qualityCutoffScore}%)
          </span>
        </div>
        <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">
          Arrhenius Q10 Kinetics
        </span>
      </div>
    </div>
  );
};
