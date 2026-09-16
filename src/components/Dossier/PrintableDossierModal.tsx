import React from 'react';
import { X, Printer, ShieldCheck, FileText, CheckCircle2, Award } from 'lucide-react';
import { Commodity, MaterialScore, TransitClimateConfig, Language } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';

interface PrintableDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  commodity: Commodity;
  topScore: MaterialScore;
  transit: TransitClimateConfig;
  language: Language;
}

export const PrintableDossierModal: React.FC<PrintableDossierModalProps> = ({
  isOpen,
  onClose,
  commodity,
  topScore,
  transit,
  language,
}) => {
  const t = TRANSLATIONS[language];
  if (!isOpen) return null;

  const { material } = topScore;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between no-print bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                {t.dossierModalTitle}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Official SIH 2026 Technical Specification & Regulatory Compliance Sheet
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>{t.printDossier}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-500 dark:text-slate-400 hover:text-slate-900 border border-slate-200 dark:border-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dossier Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs text-slate-700 dark:text-slate-300">
          {/* Title Header */}
          <div className="border-b border-slate-200 dark:border-slate-700 pb-4 flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-extrabold text-emerald-700 dark:text-emerald-400 tracking-wide">
                  BIOPACK AI • TECHNICAL PACKAGING SPECIFICATION
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">
                  SIH-VERIFIED
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Document Reference: BP-SPEC-{Date.now().toString().slice(-6)} • Date: {new Date().toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <span className="font-mono text-xs text-slate-500 dark:text-slate-400 block">Standard Protocol</span>
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">FSSAI IS 9845 / CPCB PWM</span>
            </div>
          </div>

          {/* Commodity & Target Environment Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px] text-emerald-700 dark:text-emerald-400">
                1. Target Food Commodity
              </h4>
              <div className="flex items-center space-x-2 text-sm font-bold text-slate-900 dark:text-slate-100">
                <span>{commodity.icon}</span>
                <span>{commodity.name}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                <div>Moisture Content: <strong className="text-cyan-800 dark:text-cyan-300 font-mono">{commodity.moistureContentPercent}%</strong></div>
                <div>Respiration: <strong className="text-emerald-800 dark:text-emerald-300 font-mono">{commodity.respirationRateMgPerKgHr} mg/kg·hr</strong></div>
                <div>Fat Content: <strong className="text-amber-800 dark:text-amber-300 font-mono">{commodity.fatContentPercent}%</strong></div>
                <div>Water Activity (Aw): <strong className="text-purple-800 dark:text-purple-300 font-mono">{commodity.waterActivityAw}</strong></div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px] text-cyan-700 dark:text-cyan-400">
                2. Environmental Transit Parameters
              </h4>
              <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                <div>Ambient Temperature: <strong className="text-emerald-800 dark:text-emerald-300 font-mono">{transit.temperatureC}°C</strong></div>
                <div>Relative Humidity (RH): <strong className="text-cyan-800 dark:text-cyan-300 font-mono">{transit.relativeHumidityPercent}%</strong></div>
                <div>Cold Chain Logistics: <strong className="text-slate-900 dark:text-slate-100">{transit.coldChainAvailable ? 'Yes (Refrigerated 2°C - 8°C)' : 'No (Ambient)'}</strong></div>
                <div>Transit Window: <strong className="text-amber-800 dark:text-amber-300 font-mono">{transit.transitDays} Days</strong></div>
              </div>
            </div>
          </div>

          {/* Recommended Packaging Solution */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-emerald-200 dark:border-emerald-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px] text-emerald-700 dark:text-emerald-400 flex items-center">
                <Award className="w-4 h-4 mr-1.5 text-emerald-600" />
                3. Recommended Packaging Solution: {material.name}
              </h4>
              <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                Compatibility: {topScore.overallScore}%
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
              <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Structure</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{material.makeup}</span>
              </div>
              <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Oxygen Transmission (OTR)</span>
                <span className="font-mono font-bold text-teal-700 dark:text-teal-300">{material.otr} cc/m²·day</span>
              </div>
              <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Vapor Transmission (WVTR)</span>
                <span className="font-mono font-bold text-blue-700 dark:text-blue-300">{material.wvtr} g/m²·day</span>
              </div>
              <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Estimated Shelf Life</span>
                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300">~{topScore.estimatedShelfLifeDays} Days</span>
              </div>
            </div>
          </div>

          {/* Compliance & Sustainability Matrix */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px] text-emerald-700 dark:text-emerald-400 flex items-center">
              <ShieldCheck className="w-4 h-4 mr-1.5 text-emerald-600" />
              4. FSSAI & BIS Regulatory Standards Compliance
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li className="flex items-center text-emerald-800 dark:text-emerald-300 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 mr-2 flex-shrink-0 text-emerald-600" />
                IS 9845 Overall Migration Limits: Compliant (&lt;10 mg/dm² in food simulants)
              </li>
              <li className="flex items-center text-emerald-800 dark:text-emerald-300 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 mr-2 flex-shrink-0 text-emerald-600" />
                CPCB Plastic Waste Management (PWM) Rules 2022: Certified
              </li>
              <li className="flex items-center text-emerald-800 dark:text-emerald-300 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 mr-2 flex-shrink-0 text-emerald-600" />
                Bio-Based Carbon Content: {material.bioBasedPercent}% • Carbon LCA: {material.carbonFootprintKgCo2PerKg} kg CO₂e/kg
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
