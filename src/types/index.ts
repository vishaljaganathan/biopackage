export type CommodityCategory = 'produce' | 'dairy' | 'spices_dry' | 'protein';

export interface Commodity {
  id: string;
  name: string;
  category: CommodityCategory;
  description: string;
  icon: string;
  // Biochemical Baseline Specs
  moistureContentPercent: number; // e.g., 84% for mango, 52% for paneer, 10% for spices
  respirationRateMgPerKgHr: number; // e.g., 45 for mango at 20C, 0 for dry goods
  fatContentPercent: number; // e.g., 22% for paneer, 0.4% for mango
  oxygenSensitivity: number; // 1 - 10 scale (10 being ultra-sensitive like paneer/fats)
  moistureSensitivity: number; // 1 - 10 scale (10 being ultra-sensitive like dry powders/spices)
  waterActivityAw: number; // e.g. 0.98 for paneer, 0.35 for coffee
  ethyleneProduction: 'High' | 'Medium' | 'Low' | 'None';
  idealTempMinC: number;
  idealTempMaxC: number;
  idealRhMinPercent: number;
  idealRhMaxPercent: number;
  baselineShelfLifeDays: number; // unchilled / standard open atmosphere
  chilledShelfLifeDays: number; // 4C cold-chain
  qualityCutoffScore: number; // default 60%
}

export interface MaterialSpec {
  id: string;
  name: string;
  category: 'bio_compostable' | 'high_barrier' | 'circular_recycled' | 'active_functional';
  makeup: string; // e.g. "PLA / PBAT blend 40µm"
  thicknessUm: number; // micrometers
  otr: number; // Oxygen Transmission Rate (cc / m² / 24hr / 1atm at 23°C, 0% RH)
  wvtr: number; // Water Vapor Transmission Rate (g / m² / 24hr at 38°C, 90% RH)
  tensileStrengthMpa: number; // MegaPascals
  punctureResistanceN: number; // Newtons
  sealStrengthNPer15mm: number;
  costPerKgInr: number; // Base cost in INR / kg
  costIndex: number; // 1 - 10 (10 = premium expensive, 1 = ultra cheap)
  bioBasedPercent: number; // 0 - 100%
  carbonFootprintKgCo2PerKg: number; // Life Cycle Analysis CO2e / kg
  isHomeCompostable: boolean;
  isIndustrialCompostable: boolean;
  isRecyclable: boolean;
  fssaiCompliance: {
    is9845Migration: boolean; // IS 9845 Overall Migration Limit (< 10mg/dm² or 60mg/kg)
    is10146FoodGrade: boolean; // Positive list for food contact
    astmD6400Compostable?: boolean; // ASTM D6400 / IS 17088
    cpbcPwmRulesCompliant: boolean; // CPCB Plastic Waste Management Rules 2022
    notes: string;
  };
  highlightFeatures: string[];
}

export interface MaterialScore {
  material: MaterialSpec;
  overallScore: number;
  barrierFitScore: number;
  shelfLifeScore: number;
  costScore: number;
  ecoScore: number;
  estimatedShelfLifeDays: number;
  tier: 'tier1_best_overall' | 'tier2_most_sustainable' | 'tier3_budget_pick' | 'alternative';
}

export interface PriorityWeights {
  costWeight: number; // e.g. 33.3%
  shelfLifeWeight: number; // e.g. 33.3%
  ecoWeight: number; // e.g. 33.4%
}

export interface TransitClimateConfig {
  temperatureC: number;
  relativeHumidityPercent: number;
  coldChainAvailable: boolean;
  transitDays: number;
}

export interface SimulationDayData {
  day: number;
  qualityScore: number; // 100 -> 0
  microbialQuality: number; // 100 -> 0
  oxidationQuality: number; // 100 -> 0
  moistureRetention: number; // 100 -> 0
  isSpoiled: boolean;
}

export interface Vendor {
  id: string;
  name: string;
  location: string;
  state: string;
  materialsSupplied: string[]; // matching material IDs
  moqKg: number; // Minimum Order Quantity in kg
  leadTimeDays: number;
  certifications: string[];
  contactEmail: string;
  contactPhone: string;
  rating: number;
  description: string;
}

export type Language = 'en' | 'hi' | 'ta';
