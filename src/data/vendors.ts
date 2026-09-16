import { Vendor } from '../types';

export const VENDORS: Vendor[] = [
  {
    id: 'natur_tec_india',
    name: 'Natur-Tec India Pvt Ltd',
    location: 'Chennai & Bengaluru',
    state: 'Tamil Nadu',
    materialsSupplied: ['pla_pbat_blend', 'pha_marine_degradable'],
    moqKg: 250,
    leadTimeDays: 7,
    certifications: ['CIPET Certified', 'ISO 17088', 'FSSAI Compliant', 'TÜV OK Compost'],
    contactEmail: 'sales@naturtec.in',
    contactPhone: '+91 44 2658 9100',
    rating: 4.9,
    description: 'Leading bioplastics innovator delivering certified compostable and bio-resins engineered specifically for tropical Indian shelf-life requirements.'
  },
  {
    id: 'yash_pakka_chuk',
    name: 'Yash Pakka / Chuk Compostables',
    location: 'Ayodhya & Lucknow',
    state: 'Uttar Pradesh',
    materialsSupplied: ['bio_nanocellulose_kraft', 'pla_pbat_blend'],
    moqKg: 500,
    leadTimeDays: 10,
    certifications: ['BIS IS 17088', 'FSSAI Approved', 'B-Corp Certified', 'EN 13432'],
    contactEmail: 'procurement@yashpakka.com',
    contactPhone: '+91 5278 258 400',
    rating: 4.8,
    description: 'Pioneering agro-residue sugarcane bagasse and bio-cellulose barrier paper converters focused on regenerative circular packaging.'
  },
  {
    id: 'uflex_green_packaging',
    name: 'UFlex Limited (Eco-Barrier Division)',
    location: 'Noida & Sanand',
    state: 'Gujarat / Uttar Pradesh',
    materialsSupplied: ['evoh_multilayer_7layer', 'mdo_pe_monomaterial', 'rpet_silica_coated'],
    moqKg: 1000,
    leadTimeDays: 14,
    certifications: ['ISO 9001/22000', 'BRC-GS Packaging', 'US-FDA & FSSAI', 'CPCB Registered'],
    contactEmail: 'flexibles@uflexltd.com',
    contactPhone: '+91 120 401 2345',
    rating: 4.7,
    description: 'India’s multinational packaging giant offering high-speed co-extrusion 7-layer EVOH films and 100% recyclable mono-material PE pouches.'
  },
  {
    id: 'ecolife_bioplastics',
    name: 'Ecolife Bio-Plastics India',
    location: 'Ahmedabad & Surat',
    state: 'Gujarat',
    materialsSupplied: ['pla_pbat_blend', 'chitosan_antimicrobial_film', 'pha_marine_degradable'],
    moqKg: 150,
    leadTimeDays: 5,
    certifications: ['CPCB PWM 2022 Certified', 'IS 9845 Migration Pass', 'CIPET Tested'],
    contactEmail: 'info@ecolifebioplastics.in',
    contactPhone: '+91 79 4900 8820',
    rating: 4.8,
    description: 'Specialized bio-polymer compounder with quick turnaround times and flexible low MOQs for D2C food brands and agricultural exporters.'
  },
  {
    id: 'cosmo_films_speciality',
    name: 'Cosmo First / Cosmo Speciality Films',
    location: 'Aurangabad & New Delhi',
    state: 'Maharashtra / Delhi NCR',
    materialsSupplied: ['metallized_bopp_pe', 'rpet_silica_coated', 'mdo_pe_monomaterial'],
    moqKg: 750,
    leadTimeDays: 10,
    certifications: ['ISO 14001', 'FSSC 22000', 'FSSAI Food Contact Compliant'],
    contactEmail: 'barrier@cosmofirst.com',
    contactPhone: '+91 11 4949 4949',
    rating: 4.6,
    description: 'Global master in specialty barrier films, metallized high-barrier BoPP, and ceramic-coated ultra-clear barrier solutions.'
  }
];
