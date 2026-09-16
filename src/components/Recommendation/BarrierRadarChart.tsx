import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { Shield, Sparkles } from 'lucide-react';
import { MaterialScore, Language } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';

interface BarrierRadarChartProps {
  topScores: MaterialScore[];
  language: Language;
}

export const BarrierRadarChart: React.FC<BarrierRadarChartProps> = ({
  topScores,
  language,
}) => {
  const t = TRANSLATIONS[language];

  const tier1 = topScores[0];
  const tier2 = topScores[1];
  const tier3 = topScores[2];

  const normalizeOxygenBarrier = (otr: number) => {
    return Math.max(15, Math.min(100, Math.round(100 - (otr / 450) * 80)));
  };

  const normalizeMoistureBarrier = (wvtr: number) => {
    return Math.max(15, Math.min(100, Math.round(100 - (wvtr / 50) * 80)));
  };

  const normalizePuncture = (p: number) => {
    return Math.max(20, Math.min(100, Math.round((p / 35) * 100)));
  };

  const normalizeSeal = (s: number) => {
    return Math.max(20, Math.min(100, Math.round((s / 40) * 100)));
  };

  const normalizeCostEfficiency = (inr: number) => {
    return Math.max(20, Math.min(100, Math.round(100 - ((inr - 150) / 300) * 75)));
  };

  const radarData = [
    {
      metric: 'Oxygen Barrier (OTR)',
      [tier1?.material.name || 'Tier 1']: tier1 ? normalizeOxygenBarrier(tier1.material.otr) : 0,
      [tier2?.material.name || 'Tier 2']: tier2 ? normalizeOxygenBarrier(tier2.material.otr) : 0,
      [tier3?.material.name || 'Tier 3']: tier3 ? normalizeOxygenBarrier(tier3.material.otr) : 0,
    },
    {
      metric: 'Moisture Barrier (WVTR)',
      [tier1?.material.name || 'Tier 1']: tier1 ? normalizeMoistureBarrier(tier1.material.wvtr) : 0,
      [tier2?.material.name || 'Tier 2']: tier2 ? normalizeMoistureBarrier(tier2.material.wvtr) : 0,
      [tier3?.material.name || 'Tier 3']: tier3 ? normalizeMoistureBarrier(tier3.material.wvtr) : 0,
    },
    {
      metric: 'Puncture Resistance',
      [tier1?.material.name || 'Tier 1']: tier1 ? normalizePuncture(tier1.material.punctureResistanceN) : 0,
      [tier2?.material.name || 'Tier 2']: tier2 ? normalizePuncture(tier2.material.punctureResistanceN) : 0,
      [tier3?.material.name || 'Tier 3']: tier3 ? normalizePuncture(tier3.material.punctureResistanceN) : 0,
    },
    {
      metric: 'Seal Strength',
      [tier1?.material.name || 'Tier 1']: tier1 ? normalizeSeal(tier1.material.sealStrengthNPer15mm) : 0,
      [tier2?.material.name || 'Tier 2']: tier2 ? normalizeSeal(tier2.material.sealStrengthNPer15mm) : 0,
      [tier3?.material.name || 'Tier 3']: tier3 ? normalizeSeal(tier3.material.sealStrengthNPer15mm) : 0,
    },
    {
      metric: 'Cost Efficiency',
      [tier1?.material.name || 'Tier 1']: tier1 ? normalizeCostEfficiency(tier1.material.costPerKgInr) : 0,
      [tier2?.material.name || 'Tier 2']: tier2 ? normalizeCostEfficiency(tier2.material.costPerKgInr) : 0,
      [tier3?.material.name || 'Tier 3']: tier3 ? normalizeCostEfficiency(tier3.material.costPerKgInr) : 0,
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4.5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center">
              {t.barrierRadarTitle}
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 ml-1.5" />
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {t.radarSubtitle}
            </p>
          </div>
        </div>
      </div>

      <div className="w-full h-80 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
            <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
            <PolarAngleAxis
              dataKey="metric"
              tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: '#94a3b8', fontSize: 9 }}
              stroke="#cbd5e1"
            />
            {tier1 && (
              <Radar
                name={`${tier1.material.name} (Best Overall)`}
                dataKey={tier1.material.name}
                stroke="#059669"
                fill="#10b981"
                fillOpacity={0.45}
                strokeWidth={2.5}
              />
            )}
            {tier2 && (
              <Radar
                name={`${tier2.material.name} (Most Sustainable)`}
                dataKey={tier2.material.name}
                stroke="#0891b2"
                fill="#06b6d4"
                fillOpacity={0.3}
                strokeWidth={2}
              />
            )}
            {tier3 && (
              <Radar
                name={`${tier3.material.name} (Budget Pick)`}
                dataKey={tier3.material.name}
                stroke="#d97706"
                fill="#f59e0b"
                fillOpacity={0.25}
                strokeWidth={2}
              />
            )}
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                borderColor: '#cbd5e1',
                borderRadius: '0.75rem',
                fontSize: '11px',
                color: '#0f172a',
                boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
              }}
            />
            <Legend
              wrapperStyle={{
                fontSize: '11px',
                paddingTop: '12px',
                color: '#334155',
                fontWeight: 500,
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
