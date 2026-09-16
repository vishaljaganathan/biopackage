import { Commodity, MaterialSpec, SimulationDayData, TransitClimateConfig } from '../types';

/**
 * Calculates shelf life kinetics using an Arrhenius-based multi-vector spoilage model:
 * 1. Microbial Growth Kinetics (Gompertz / Arrhenius temperature dependence)
 * 2. Lipid Oxidation & Rancidity Kinetics (OTR barrier permeation + fat content)
 * 3. Moisture Sorption / Transpiration (WVTR + RH differential)
 */
export function simulateShelfLife(
  commodity: Commodity,
  material: MaterialSpec,
  transit: TransitClimateConfig,
  totalDays: number = 60
): {
  timeline: SimulationDayData[];
  daysToSpoilage: number;
  primarySpoilageVector: 'Microbial Spoilage' | 'Lipid Oxidation' | 'Moisture Migration' | 'None';
  spoilageReason: string;
} {
  const timeline: SimulationDayData[] = [];
  const cutoff = commodity.qualityCutoffScore;

  // Temperature Acceleration Factor (Arrhenius Q10 approximation)
  // Baseline reference temperature is 4°C (chilled) or 20°C (ambient)
  const refTemp = transit.coldChainAvailable ? 4.0 : 22.0;
  const tempDiff = transit.temperatureC - refTemp;
  // Q10 temperature coefficient: typically 2.2 for biological food systems
  const q10Factor = Math.pow(2.2, tempDiff / 10.0);

  // Oxygen Permeation Vector
  // Higher OTR increases oxidation rate, weighted by commodity fat % and oxygen sensitivity
  const isHighRespirationProduce = commodity.respirationRateMgPerKgHr > 20;
  let oxygenStressRate = 0.01;

  if (isHighRespirationProduce) {
    // For fresh produce, if OTR is too low (< 15), anaerobic fermentation triggers off-flavors!
    // If OTR is moderate (50 - 450), produce breathes comfortably in equilibrium MAP.
    if (material.otr < 20) {
      oxygenStressRate = 0.045 * (commodity.oxygenSensitivity / 5); // Anaerobic spoilage penalty
    } else if (material.otr > 300) {
      oxygenStressRate = 0.035 * (commodity.oxygenSensitivity / 5); // Fast senescence
    } else {
      oxygenStressRate = 0.015; // Optimal MAP breathing balance
    }
  } else {
    // For dairy, meats, fats, dry spices: lower OTR = drastically slower oxidation
    const normalizedOtr = material.otr / 100.0;
    oxygenStressRate = (0.005 + 0.025 * Math.min(normalizedOtr, 3.0)) * 
      (commodity.fatContentPercent / 15 + commodity.oxygenSensitivity / 8);
  }

  // Moisture Vapor Migration Vector
  // Driven by difference between environmental RH and food water activity / ideal RH, scaled by WVTR
  const ambientRhFraction = transit.relativeHumidityPercent / 100.0;
  const foodAw = commodity.waterActivityAw;
  const rhDelta = Math.abs(ambientRhFraction - foodAw);
  const moistureStressRate = (material.wvtr / 50.0) * rhDelta * (commodity.moistureSensitivity / 7.0) * 0.04;

  // Microbial Growth Vector
  // Driven by water activity, temperature, and material barrier integrity
  let microbialBaseRate = (foodAw > 0.85 ? 0.035 : 0.004) * (transit.temperatureC > 8 ? 1.8 : 0.5);
  // Active antimicrobial materials (e.g. Chitosan) retard microbial growth by 40%
  if (material.category === 'active_functional') {
    microbialBaseRate *= 0.55;
  }

  // Combined daily degradation steps
  let microbialQuality = 100;
  let oxidationQuality = 100;
  let moistureQuality = 100;

  let daysToSpoilage = totalDays;
  let primarySpoilageVector: 'Microbial Spoilage' | 'Lipid Oxidation' | 'Moisture Migration' | 'None' = 'None';
  let spoilageReason = 'Preserved in high quality standard';

  for (let day = 0; day <= totalDays; day++) {
    if (day > 0) {
      // Non-linear degradation progression (accelerates as safety margins diminish)
      const nonLinearAccel = 1.0 + (day / totalDays) * 0.4;

      microbialQuality = Math.max(0, microbialQuality - (microbialBaseRate * q10Factor * nonLinearAccel * 10));
      oxidationQuality = Math.max(0, oxidationQuality - (oxygenStressRate * Math.max(0.6, q10Factor * 0.8) * nonLinearAccel * 10));
      moistureQuality = Math.max(0, moistureQuality - (moistureStressRate * Math.max(0.7, q10Factor * 0.5) * nonLinearAccel * 10));
    }

    // Overall quality is determined by the weakest biochemical vector
    const currentScore = Math.round(
      Math.min(microbialQuality, oxidationQuality, moistureQuality) * 10
    ) / 10;

    const isSpoiled = currentScore <= cutoff;

    if (isSpoiled && daysToSpoilage === totalDays) {
      daysToSpoilage = day;
      if (microbialQuality <= cutoff) {
        primarySpoilageVector = 'Microbial Spoilage';
        spoilageReason = `Microbial growth threshold exceeded at ${transit.temperatureC}°C due to high water activity (Aw: ${commodity.waterActivityAw})`;
      } else if (oxidationQuality <= cutoff) {
        primarySpoilageVector = 'Lipid Oxidation';
        spoilageReason = `Lipid oxidation and sensory rancidity caused by OTR permeation (${material.otr} cc/m²/day)`;
      } else {
        primarySpoilageVector = 'Moisture Migration';
        spoilageReason = `Moisture vapor migration through barrier (${material.wvtr} g/m²/day) caused texture loss / caking`;
      }
    }

    timeline.push({
      day,
      qualityScore: Math.max(0, currentScore),
      microbialQuality: Math.round(microbialQuality),
      oxidationQuality: Math.round(oxidationQuality),
      moistureRetention: Math.round(moistureQuality),
      isSpoiled,
    });
  }

  return {
    timeline,
    daysToSpoilage,
    primarySpoilageVector,
    spoilageReason,
  };
}
