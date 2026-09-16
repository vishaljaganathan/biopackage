import { Commodity, MaterialSpec, MaterialScore, PriorityWeights, TransitClimateConfig } from '../types';
import { MATERIALS } from '../data/materials';
import { simulateShelfLife } from './simulationEngine';

export function rankMaterials(
  commodity: Commodity,
  transit: TransitClimateConfig,
  weights: PriorityWeights
): MaterialScore[] {
  // Normalize weights to sum to 1.0
  const totalWeight = weights.costWeight + weights.shelfLifeWeight + weights.ecoWeight || 100;
  const wCost = weights.costWeight / totalWeight;
  const wShelfLife = weights.shelfLifeWeight / totalWeight;
  const wEco = weights.ecoWeight / totalWeight;

  const isProduce = commodity.respirationRateMgPerKgHr > 10;

  const scoredMaterials: MaterialScore[] = MATERIALS.map((material) => {
    // 1. Simulate shelf life for this material under transit conditions
    const sim = simulateShelfLife(commodity, material, transit, 45);
    const estimatedDays = sim.daysToSpoilage;

    // Shelf life score (0 - 100)
    const shelfLifeScore = Math.min(100, Math.round((estimatedDays / 35) * 100));

    // 2. Barrier Fit Score (0 - 100)
    let barrierFitScore = 70;
    if (isProduce) {
      // Produce requires moderate breathable OTR
      if (material.otr >= 40 && material.otr <= 500) {
        barrierFitScore = 95;
      } else if (material.otr < 20) {
        barrierFitScore = 40; // Risk of anaerobic fermentation
      } else {
        barrierFitScore = 75;
      }
    } else {
      // Non-produce (dairy, spices, meats): Lower OTR and WVTR is superior
      const otrBonus = Math.max(0, 50 - material.otr * 2);
      const wvtrBonus = Math.max(0, 50 - material.wvtr * 3);
      barrierFitScore = Math.min(100, Math.max(20, Math.round(otrBonus + wvtrBonus)));
    }

    // 3. Cost Score (0 - 100): Lower costPerKg = higher score
    // Range from ~160 to ~420 INR
    const costScore = Math.max(10, Math.min(100, Math.round(100 - ((material.costPerKgInr - 150) / 300) * 85)));

    // 4. Eco Score (0 - 100)
    let ecoScore = material.bioBasedPercent * 0.55;
    if (material.isHomeCompostable) ecoScore += 25;
    if (material.isRecyclable) ecoScore += 15;
    // Penalty for high carbon footprint
    ecoScore -= material.carbonFootprintKgCo2PerKg * 5;
    ecoScore = Math.max(10, Math.min(100, Math.round(ecoScore)));

    // Composite Weighted Score
    // Barrier fit acts as a baseline safety multiplier (min 0.4)
    const safetyMultiplier = barrierFitScore >= 50 ? 1.0 : barrierFitScore / 50;
    const overallScore = Math.round(
      (wCost * costScore + wShelfLife * shelfLifeScore + wEco * ecoScore) * safetyMultiplier
    );

    return {
      material,
      overallScore,
      barrierFitScore,
      shelfLifeScore,
      costScore,
      ecoScore,
      estimatedShelfLifeDays: estimatedDays,
      tier: 'alternative',
    };
  });

  // Sort by overall composite score descending
  scoredMaterials.sort((a, b) => b.overallScore - a.overallScore);

  // Identify Tier 1: Best Overall (Rank #1)
  const tier1 = scoredMaterials[0];
  tier1.tier = 'tier1_best_overall';

  // Identify Tier 2: Most Sustainable (Highest Eco Score among top contenders)
  // Look for the material with highest ecoScore that is not Tier 1
  let bestEcoIndex = -1;
  let maxEco = -1;
  for (let i = 1; i < scoredMaterials.length; i++) {
    if (scoredMaterials[i].ecoScore > maxEco && scoredMaterials[i].estimatedShelfLifeDays >= 5) {
      maxEco = scoredMaterials[i].ecoScore;
      bestEcoIndex = i;
    }
  }
  if (bestEcoIndex !== -1) {
    scoredMaterials[bestEcoIndex].tier = 'tier2_most_sustainable';
  }

  // Identify Tier 3: Budget Pick (Highest Cost Score that is not Tier 1 or Tier 2)
  let bestCostIndex = -1;
  let maxCost = -1;
  for (let i = 1; i < scoredMaterials.length; i++) {
    if (i !== bestEcoIndex && scoredMaterials[i].costScore > maxCost && scoredMaterials[i].estimatedShelfLifeDays >= 5) {
      maxCost = scoredMaterials[i].costScore;
      bestCostIndex = i;
    }
  }
  if (bestCostIndex !== -1) {
    scoredMaterials[bestCostIndex].tier = 'tier3_budget_pick';
  }

  return scoredMaterials;
}
