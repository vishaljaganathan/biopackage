import React, { useState, useMemo } from 'react';
import {
  X,
  Building2,
  MapPin,
  Clock,
  CheckCircle,
  DollarSign,
  Leaf,
  Layers,
  Send,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MaterialSpec, Language } from '../../types';
import { VENDORS } from '../../data/vendors';
import { persistRfq } from '../../services/firebase';
import { TRANSLATIONS } from '../../i18n/translations';

interface VendorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  material: MaterialSpec | null;
  language: Language;
}

export const VendorDrawer: React.FC<VendorDrawerProps> = ({
  isOpen,
  onClose,
  material,
  language,
}) => {
  const t = TRANSLATIONS[language];

  const [batchKg, setBatchKg] = useState<number>(500);
  const [selectedVendorId, setSelectedVendorId] = useState<string>('');
  const [rfqSuccess, setRfqSuccess] = useState<boolean>(false);
  const [rfqTicketId, setRfqTicketId] = useState<string>('');

  const matchedVendors = useMemo(() => {
    if (!material) return [];
    const directMatches = VENDORS.filter((v) => v.materialsSupplied.includes(material.id));
    if (directMatches.length > 0) return directMatches;
    return VENDORS.slice(0, 3);
  }, [material]);

  React.useEffect(() => {
    if (matchedVendors.length > 0 && !selectedVendorId) {
      setSelectedVendorId(matchedVendors[0].id);
    }
  }, [matchedVendors, selectedVendorId]);

  const activeVendor = useMemo(() => {
    return matchedVendors.find((v) => v.id === selectedVendorId) || matchedVendors[0] || VENDORS[0];
  }, [matchedVendors, selectedVendorId]);

  if (!isOpen || !material) return null;

  const pouchesPerKg = Math.round(1000 / (material.thicknessUm * 0.6));
  const totalPouches = batchKg * pouchesPerKg;
  const totalOrderCostInr = Math.round(batchKg * material.costPerKgInr);
  const unitPouchCostInr = (totalOrderCostInr / totalPouches).toFixed(2);

  const virginLca = 3.85;
  const co2SavedKg = Math.max(0, Math.round((virginLca - material.carbonFootprintKgCo2PerKg) * batchKg));
  const isMoqMet = activeVendor ? batchKg >= activeVendor.moqKg : true;

  const handleGenerateRfq = async () => {
    const ticketId = `RFQ-SIH-${Math.floor(100000 + Math.random() * 900000)}`;
    setRfqTicketId(ticketId);

    await persistRfq({
      materialId: material.id,
      materialName: material.name,
      vendorId: activeVendor.id,
      vendorName: activeVendor.name,
      batchUnits: totalPouches,
      estimatedTotalInr: totalOrderCostInr,
      unitPriceInr: parseFloat(unitPouchCostInr),
      co2SavedKg,
      timestamp: new Date().toISOString(),
    });

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#059669', '#0891b2', '#10b981', '#f59e0b']
    });

    setRfqSuccess(true);
    setTimeout(() => {
      setRfqSuccess(false);
    }, 6000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-white/95 dark:bg-slate-950/95 border-l border-slate-200 dark:border-slate-800 backdrop-blur-2xl text-slate-900 dark:text-slate-100 p-6 flex flex-col justify-between overflow-y-auto shadow-2xl">
          {/* Top Bar */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center">
                    {t.vendorDrawerTitle}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t.vendorDrawerSubtitle}
                  </p>
                </div>
              </div>
              <button
                id="close-vendor-drawer-btn"
                onClick={onClose}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 text-slate-500 dark:text-slate-400 hover:text-slate-900 border border-slate-200 dark:border-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Selected Material Card */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400">
                  {material.name}
                </span>
                <span className="text-xs font-mono text-amber-700 dark:text-amber-400 font-bold">
                  ₹{material.costPerKgInr} / kg
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
                <Layers className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                {material.makeup}
              </p>
            </div>

            {/* Batch Cost & MOQ Calculator */}
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-200 flex items-center">
                  <DollarSign className="w-4 h-4 text-emerald-600 mr-1 flex-shrink-0" />
                  {t.batchCalculator}
                </h3>
                <span className="text-[11px] text-cyan-700 dark:text-cyan-400 font-mono font-bold text-right">
                  ~{totalPouches.toLocaleString()} Pouches ({pouchesPerKg}/kg)
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-700 dark:text-slate-300 font-semibold">
                  <span>{t.batchQuantity}:</span>
                  <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">{batchKg} kg</span>
                </div>
                <input
                  id="batch-quantity-slider"
                  type="range"
                  min="50"
                  max="5000"
                  step="50"
                  value={batchKg}
                  onChange={(e) => setBatchKg(parseInt(e.target.value, 10))}
                  className="w-full accent-emerald-600"
                />
              </div>

              {/* Price & Environmental Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="bg-slate-50 dark:bg-slate-850 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">{t.totalOrderCost}</span>
                  <span className="text-base font-extrabold text-amber-700 dark:text-amber-400 font-mono">
                    ₹{totalOrderCostInr.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-850 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">{t.unitCost}</span>
                  <span className="text-base font-extrabold text-cyan-700 dark:text-cyan-400 font-mono">
                    ₹{unitPouchCostInr} / unit
                  </span>
                </div>
              </div>

              {/* Carbon Offset Saving Banner */}
              <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs text-emerald-900 dark:text-emerald-300">
                <span className="flex items-center font-semibold">
                  <Leaf className="w-4 h-4 mr-1.5 text-emerald-600" />
                  {t.co2Saved}:
                </span>
                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                  -{co2SavedKg.toLocaleString()} kg CO₂e
                </span>
              </div>

              {/* MOQ Validation Alert */}
              {!isMoqMet && (
                <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center space-x-2 text-xs text-amber-900 dark:text-amber-300">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-600" />
                  <span>
                    Batch ({batchKg} kg) is below supplier MOQ ({activeVendor.moqKg} kg). Small-lot fees apply.
                  </span>
                </div>
              )}
            </div>

            {/* Mapped Indian Suppliers Selection */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-300 flex items-center">
                <MapPin className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 mr-1" />
                Verified Indian Packaging Converters ({matchedVendors.length})
              </h3>

              <div className="space-y-2">
                {matchedVendors.map((vendor) => {
                  const isSelected = vendor.id === selectedVendorId;
                  return (
                    <div
                      key={vendor.id}
                      onClick={() => setSelectedVendorId(vendor.id)}
                      className={`cursor-pointer p-3 rounded-xl transition-all border ${
                        isSelected
                          ? 'bg-emerald-50/70 dark:bg-slate-900 border-2 border-emerald-500 shadow-xs'
                          : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center">
                            {vendor.name}
                            <span className="ml-2 px-1.5 py-0.2 rounded text-[9px] font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200">
                              ★ {vendor.rating}
                            </span>
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center mt-0.5">
                            <MapPin className="w-3 h-3 mr-1 text-slate-400" />
                            {vendor.location} ({vendor.state})
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block">{t.leadTime}</span>
                          <span className="text-xs font-mono font-bold text-cyan-700 dark:text-cyan-400 flex items-center justify-end">
                            <Clock className="w-3 h-3 mr-1" />
                            {vendor.leadTimeDays} days
                          </span>
                        </div>
                      </div>

                      <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-1.5 line-clamp-2">
                        {vendor.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {vendor.certifications.map((cert, cIdx) => (
                          <span
                            key={cIdx}
                            className="px-1.5 py-0.5 rounded text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-mono whitespace-nowrap"
                          >
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
            {rfqSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-xs text-emerald-900 dark:text-emerald-300 flex items-center space-x-2 animate-in fade-in zoom-in-95">
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <div>
                  <p className="font-bold">{t.rfqSent}</p>
                  <p className="text-[11px] opacity-90">
                    Ref ID: <span className="font-mono font-bold">{rfqTicketId}</span>. Sent to {activeVendor.name}.
                  </p>
                </div>
              </div>
            )}

            <button
              id="generate-rfq-submit-btn"
              onClick={handleGenerateRfq}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center space-x-2 shadow-md shadow-emerald-600/20 transition-all active:scale-[0.99]"
            >
              <Send className="w-4 h-4" />
              <span>{t.requestRfq}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
