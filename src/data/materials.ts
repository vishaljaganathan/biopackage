import { MaterialSpec } from '../types';

export const MATERIALS: MaterialSpec[] = [
  {
    id: 'pla_pbat_blend',
    name: 'PLA / PBAT Bio-Composite Film',
    category: 'bio_compostable',
    makeup: 'Poly(lactic acid) + Polybutyrate Adipate Terephthalate (40µm)',
    thicknessUm: 40,
    otr: 420.0, // cc / m² / day / atm
    wvtr: 48.0, // g / m² / day
    tensileStrengthMpa: 34.0,
    punctureResistanceN: 14.5,
    sealStrengthNPer15mm: 18.0,
    costPerKgInr: 285.0,
    costIndex: 6.2,
    bioBasedPercent: 88,
    carbonFootprintKgCo2PerKg: 1.45,
    isHomeCompostable: true,
    isIndustrialCompostable: true,
    isRecyclable: false,
    fssaiCompliance: {
      is9845Migration: true,
      is10146FoodGrade: true,
      astmD6400Compostable: true,
      cpbcPwmRulesCompliant: true,
      notes: 'Certified compostable under IS 17088 / ASTM D6400. Passes IS 9845 migration in 3% acetic acid & 10% ethanol.'
    },
    highlightFeatures: [
      '100% Biodegradable & Compostable in 90-180 days',
      'Excellent breathability for fresh produce respiration',
      'Naturally antistatic with soft silk-touch feel'
    ]
  },
  {
    id: 'evoh_multilayer_7layer',
    name: '7-Layer Co-Extruded EVOH Barrier Film',
    category: 'high_barrier',
    makeup: 'PE / Tie / EVOH / Tie / PA / Tie / mPE (65µm)',
    thicknessUm: 65,
    otr: 1.8, // Ultra-high oxygen barrier
    wvtr: 3.2, // Ultra-low moisture barrier
    tensileStrengthMpa: 62.0,
    punctureResistanceN: 32.0,
    sealStrengthNPer15mm: 36.0,
    costPerKgInr: 340.0,
    costIndex: 7.8,
    bioBasedPercent: 0,
    carbonFootprintKgCo2PerKg: 3.85,
    isHomeCompostable: false,
    isIndustrialCompostable: false,
    isRecyclable: false, // Difficult multi-material layer
    fssaiCompliance: {
      is9845Migration: true,
      is10146FoodGrade: true,
      astmD6400Compostable: false,
      cpbcPwmRulesCompliant: true,
      notes: 'Full FSSAI approval for fatty foods, dairy, vacuum MAP, and meats. Non-cytotoxic.'
    },
    highlightFeatures: [
      'Hermetic oxygen barrier (<2.0 cc/m²/day)',
      'Supreme aroma lock for spices and specialty coffee',
      'Extreme puncture resistance for bone-in or frozen goods'
    ]
  },
  {
    id: 'bio_nanocellulose_kraft',
    name: 'Bio-Nano Cellulose Coated Kraft Paper',
    category: 'bio_compostable',
    makeup: 'Virgin Bleached Kraft (45 gsm) + 4µm CNC barrier coating',
    thicknessUm: 55,
    otr: 28.0, // Exceptional barrier for a paper composite!
    wvtr: 14.5,
    tensileStrengthMpa: 48.0,
    punctureResistanceN: 18.0,
    sealStrengthNPer15mm: 22.0,
    costPerKgInr: 310.0,
    costIndex: 7.0,
    bioBasedPercent: 96,
    carbonFootprintKgCo2PerKg: 1.15,
    isHomeCompostable: true,
    isIndustrialCompostable: true,
    isRecyclable: true,
    fssaiCompliance: {
      is9845Migration: true,
      is10146FoodGrade: true,
      astmD6400Compostable: true,
      cpbcPwmRulesCompliant: true,
      notes: 'Natural biopolymer coating complies with BIS food grade criteria. Zero fluorochemicals (PFAS-free).'
    },
    highlightFeatures: [
      'Over 95% plant-based renewable carbon content',
      'Water-dispersible and pulpable in paper recycling streams',
      'High stiffness and organic tactile presentation'
    ]
  },
  {
    id: 'rpet_silica_coated',
    name: '80% Recycled rPET with SiOx Barrier',
    category: 'circular_recycled',
    makeup: '80% Post-Consumer rPET + 20nm Silicon Oxide Plasma Coat (30µm)',
    thicknessUm: 30,
    otr: 4.5,
    wvtr: 4.8,
    tensileStrengthMpa: 145.0,
    punctureResistanceN: 24.0,
    sealStrengthNPer15mm: 20.0,
    costPerKgInr: 220.0,
    costIndex: 4.8,
    bioBasedPercent: 0,
    carbonFootprintKgCo2PerKg: 1.60, // Recycled content significantly drops LCA
    isHomeCompostable: false,
    isIndustrialCompostable: false,
    isRecyclable: true, // Grade 1 PET stream
    fssaiCompliance: {
      is9845Migration: true,
      is10146FoodGrade: true,
      astmD6400Compostable: false,
      cpbcPwmRulesCompliant: true,
      notes: 'Super-cleaned bottle-grade rPET certified for direct food contact under FSSAI 2022 notification.'
    },
    highlightFeatures: [
      '80% circular recycled content lowers virgin resin demand',
      'Ultra-clear glass-like transparency with ceramic SiOx barrier',
      'Fully recyclable in existing Indian recycling infrastructure'
    ]
  },
  {
    id: 'mdo_pe_monomaterial',
    name: 'Mono-Material Recyclable MDO-PE / PE',
    category: 'circular_recycled',
    makeup: 'Machine-Direction Oriented PE + Sealable Low-Temp PE (50µm)',
    thicknessUm: 50,
    otr: 85.0,
    wvtr: 6.2,
    tensileStrengthMpa: 82.0,
    punctureResistanceN: 22.0,
    sealStrengthNPer15mm: 32.0,
    costPerKgInr: 175.0,
    costIndex: 3.5,
    bioBasedPercent: 0,
    carbonFootprintKgCo2PerKg: 2.10,
    isHomeCompostable: false,
    isIndustrialCompostable: false,
    isRecyclable: true, // 100% Mono-PE stream
    fssaiCompliance: {
      is9845Migration: true,
      is10146FoodGrade: true,
      astmD6400Compostable: false,
      cpbcPwmRulesCompliant: true,
      notes: 'Meets CPCB PWM mono-material guidelines for Category I flexible packaging.'
    },
    highlightFeatures: [
      '100% recyclable mono-material design (Zero multi-layer penalties)',
      'High seal integrity at low sealing temperatures (energy saving)',
      'Economical budget pick for widespread distribution'
    ]
  },
  {
    id: 'metallized_bopp_pe',
    name: 'Metallized BoPP / Cast PP Laminate',
    category: 'high_barrier',
    makeup: 'Met-BoPP 18µm + Solventless Adhesive + Cast PP 30µm',
    thicknessUm: 48,
    otr: 12.0,
    wvtr: 2.4,
    tensileStrengthMpa: 95.0,
    punctureResistanceN: 20.0,
    sealStrengthNPer15mm: 28.0,
    costPerKgInr: 160.0,
    costIndex: 3.0,
    bioBasedPercent: 0,
    carbonFootprintKgCo2PerKg: 2.85,
    isHomeCompostable: false,
    isIndustrialCompostable: false,
    isRecyclable: false,
    fssaiCompliance: {
      is9845Migration: true,
      is10146FoodGrade: true,
      astmD6400Compostable: false,
      cpbcPwmRulesCompliant: true,
      notes: 'Standard flexible packaging laminate with proven BIS IS 9845 non-migration characteristics.'
    },
    highlightFeatures: [
      'High light & UV reflection for rancidity prevention in fried snacks & spices',
      'Very competitive pricing per square meter',
      'Crisp metallic luster and high barrier to water vapor'
    ]
  },
  {
    id: 'chitosan_antimicrobial_film',
    name: 'Chitosan-Active Bio-Polymer Film',
    category: 'active_functional',
    makeup: 'Crustacean-derived Chitosan + Essential Oil Infusion + PLA (35µm)',
    thicknessUm: 35,
    otr: 180.0,
    wvtr: 35.0,
    tensileStrengthMpa: 28.0,
    punctureResistanceN: 12.0,
    sealStrengthNPer15mm: 15.0,
    costPerKgInr: 395.0,
    costIndex: 8.5,
    bioBasedPercent: 92,
    carbonFootprintKgCo2PerKg: 1.30,
    isHomeCompostable: true,
    isIndustrialCompostable: true,
    isRecyclable: false,
    fssaiCompliance: {
      is9845Migration: true,
      is10146FoodGrade: true,
      astmD6400Compostable: true,
      cpbcPwmRulesCompliant: true,
      notes: 'Bioactive compounds adhere to FSSAI functional packaging provisions.'
    },
    highlightFeatures: [
      'Intrinsic antimicrobial activity suppressing gram-positive & negative bacteria',
      'Extends shelf-life of artisan cheese, paneer, and fish fillets by 35%',
      'Natural bio-preservation reducing synthetic chemical additives'
    ]
  },
  {
    id: 'pha_marine_degradable',
    name: 'PHA (Polyhydroxyalkanoate) Marine Film',
    category: 'bio_compostable',
    makeup: 'Bacterial Fermentation Polyhydroxybutyrate-co-valerate (38µm)',
    thicknessUm: 38,
    otr: 65.0,
    wvtr: 18.0,
    tensileStrengthMpa: 38.0,
    punctureResistanceN: 16.0,
    sealStrengthNPer15mm: 21.0,
    costPerKgInr: 420.0,
    costIndex: 9.0,
    bioBasedPercent: 100,
    carbonFootprintKgCo2PerKg: 0.95,
    isHomeCompostable: true,
    isIndustrialCompostable: true,
    isRecyclable: false,
    fssaiCompliance: {
      is9845Migration: true,
      is10146FoodGrade: true,
      astmD6400Compostable: true,
      cpbcPwmRulesCompliant: true,
      notes: 'TÜV Austria OK Biodegradable Marine & Home certified.'
    },
    highlightFeatures: [
      '100% bio-synthesized by non-GMO microbial fermentation',
      'True marine degradability: decomposes in ocean water without microplastics',
      'Balanced gas barrier suitable for both fresh produce and dairy'
    ]
  }
];
