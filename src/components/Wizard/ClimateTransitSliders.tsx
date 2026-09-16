import React from 'react';
import { Thermometer, CloudRain, Truck, Snowflake, Sun } from 'lucide-react';
import { TransitClimateConfig, Language } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';

interface ClimateTransitSlidersProps {
  transit: TransitClimateConfig;
  onChange: (updated: TransitClimateConfig) => void;
  language: Language;
}

export const ClimateTransitSliders: React.FC<ClimateTransitSlidersProps> = ({
  transit,
  onChange,
  language,
}) => {
  const t = TRANSLATIONS[language];

  const getTempZoneLabel = (c: number) => {
    if (c <= 0) return { label: 'Deep Frozen (-5°C to 0°C)', color: 'text-blue-700 dark:text-blue-300', bg: 'bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800' };
    if (c <= 8) return { label: 'Active Cold Chain (1°C to 8°C)', color: 'text-cyan-700 dark:text-cyan-300', bg: 'bg-cyan-50 dark:bg-cyan-950/50 border-cyan-200 dark:border-cyan-800' };
    if (c <= 24) return { label: 'Controlled Ambient (9°C to 24°C)', color: 'text-emerald-700 dark:text-emerald-300', bg: 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800' };
    return { label: 'Tropical Heatwave (25°C to 45°C)', color: 'text-amber-800 dark:text-amber-300', bg: 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800' };
  };

  const getRhLabel = (rh: number) => {
    if (rh < 45) return { label: 'Arid / Low Vapor (<45%)', color: 'text-amber-700 dark:text-amber-400' };
    if (rh <= 75) return { label: 'Moderate RH (45% - 75%)', color: 'text-emerald-700 dark:text-emerald-400' };
    return { label: 'Tropical Saturated (>75% Condensation)', color: 'text-blue-700 dark:text-blue-400' };
  };

  const tempZone = getTempZoneLabel(transit.temperatureC);
  const rhInfo = getRhLabel(transit.relativeHumidityPercent);

  const handleToggleColdChain = () => {
    const nextCold = !transit.coldChainAvailable;
    onChange({
      ...transit,
      coldChainAvailable: nextCold,
      temperatureC: nextCold ? 4.0 : 26.0,
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-2.5">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-cyan-50 dark:bg-cyan-950/50 border border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-400">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {t.transitConditions}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Simulates temperature swings, ambient vapor pressure, and freight duration
            </p>
          </div>
        </div>

        {/* Cold Chain Toggle Switch */}
        <div className="flex items-center space-x-2.5 self-start sm:self-auto bg-slate-50 dark:bg-slate-850 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-1.5">
            <Snowflake className={`w-3.5 h-3.5 ${transit.coldChainAvailable ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400'}`} />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
              {t.coldChainAvailable}
            </span>
          </div>
          <button
            id="cold-chain-toggle-btn"
            type="button"
            role="switch"
            aria-checked={transit.coldChainAvailable}
            onClick={handleToggleColdChain}
            className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              transit.coldChainAvailable ? 'bg-cyan-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
                transit.coldChainAvailable ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Ambient Temperature Slider (-5°C to 45°C) */}
        <div className="space-y-1.5 bg-slate-50 dark:bg-slate-850/60 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <div className="flex justify-between items-center text-xs">
            <span className="flex items-center text-slate-700 dark:text-slate-300 font-semibold">
              <Thermometer className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 mr-1" />
              {t.temperatureRange}
            </span>
            <span className="font-mono font-bold text-sm text-emerald-700 dark:text-emerald-400">
              {transit.temperatureC}°C
            </span>
          </div>
          <input
            id="temperature-slider"
            type="range"
            min="-5"
            max="45"
            step="1"
            value={transit.temperatureC}
            onChange={(e) =>
              onChange({ ...transit, temperatureC: parseFloat(e.target.value) })
            }
            className="w-full accent-emerald-600"
          />
          <div className="flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-500 dark:text-slate-400 pt-2 gap-2 sm:gap-1">
            <span className="whitespace-nowrap">-5°C</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border text-center ${tempZone.bg} ${tempZone.color}`}>
              {tempZone.label}
            </span>
            <span className="whitespace-nowrap">45°C</span>
          </div>
        </div>

        {/* Relative Humidity Slider (20% to 95%) */}
        <div className="space-y-1.5 bg-slate-50 dark:bg-slate-850/60 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <div className="flex justify-between items-center text-xs">
            <span className="flex items-center text-slate-700 dark:text-slate-300 font-semibold">
              <CloudRain className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 mr-1" />
              {t.relativeHumidity}
            </span>
            <span className="font-mono font-bold text-sm text-cyan-700 dark:text-cyan-400">
              {transit.relativeHumidityPercent}%
            </span>
          </div>
          <input
            id="humidity-slider"
            type="range"
            min="20"
            max="95"
            step="1"
            value={transit.relativeHumidityPercent}
            onChange={(e) =>
              onChange({ ...transit, relativeHumidityPercent: parseFloat(e.target.value) })
            }
            className="w-full accent-cyan-600"
          />
          <div className="flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-500 dark:text-slate-400 pt-2 gap-2 sm:gap-1">
            <span className="whitespace-nowrap">20% RH</span>
            <span className={`font-semibold text-center ${rhInfo.color}`}>
              {rhInfo.label}
            </span>
            <span className="whitespace-nowrap">95% RH</span>
          </div>
        </div>

        {/* Estimated Transit Duration Slider (1 to 60 days) */}
        <div className="space-y-1.5 bg-slate-50 dark:bg-slate-850/60 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <div className="flex justify-between items-center text-xs">
            <span className="flex items-center text-slate-700 dark:text-slate-300 font-semibold">
              <Sun className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 mr-1" />
              {t.transitDays}
            </span>
            <span className="font-mono font-bold text-sm text-amber-700 dark:text-amber-400">
              {transit.transitDays} {t.days}
            </span>
          </div>
          <input
            id="transit-days-slider"
            type="range"
            min="1"
            max="60"
            step="1"
            value={transit.transitDays}
            onChange={(e) =>
              onChange({ ...transit, transitDays: parseInt(e.target.value, 10) })
            }
            className="w-full accent-amber-600"
          />
          <div className="flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-500 dark:text-slate-400 pt-2 gap-2 sm:gap-1">
            <span className="whitespace-nowrap">1 day</span>
            <span className="font-medium text-slate-600 dark:text-slate-300 text-center">
              {transit.transitDays <= 7 ? 'Express Domestic' : 'Cold Hub Freight'}
            </span>
            <span className="whitespace-nowrap">60 days</span>
          </div>
        </div>
      </div>
    </div>
  );
};
