import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, Firestore } from 'firebase/firestore';

// Optional Firebase configuration loaded from environment or fallback
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDummyKeyForPitchDemoMode12345",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "biopack-ai-sih.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "biopack-ai-sih",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "biopack-ai-sih.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1029384756",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1029384756:web:abcd1234efgh"
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let isFirebaseConnected = false;

try {
  if (import.meta.env.VITE_FIREBASE_API_KEY) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    db = getFirestore(app);
    isFirebaseConnected = true;
    console.log('[BioPack AI] Live Firebase Firestore connected successfully.');
  } else {
    console.log('[BioPack AI] Operating in pitch-ready resilient Offline / LocalStorage mode.');
  }
} catch (e) {
  console.warn('[BioPack AI] Firebase initialization bypassed; utilizing robust LocalStorage cache.', e);
}

export interface SavedSimulationPayload {
  commodityId: string;
  commodityName: string;
  tempC: number;
  rhPercent: number;
  coldChain: boolean;
  priorityWeights: { cost: number; shelfLife: number; eco: number };
  recommendedMaterial: string;
  daysToSpoilage: number;
  timestamp: string;
}

export interface RfqPayload {
  materialId: string;
  materialName: string;
  vendorId: string;
  vendorName: string;
  batchUnits: number;
  estimatedTotalInr: number;
  unitPriceInr: number;
  co2SavedKg: number;
  timestamp: string;
}

export async function persistSimulation(data: SavedSimulationPayload): Promise<boolean> {
  // Always cache locally for instant UI responsiveness
  try {
    const existing = JSON.parse(localStorage.getItem('biopack_simulations') || '[]');
    existing.unshift(data);
    localStorage.setItem('biopack_simulations', JSON.stringify(existing.slice(0, 30)));
  } catch (err) {
    console.error('LocalStorage write error', err);
  }

  // If live Firestore is available, sync to cloud
  if (isFirebaseConnected && db) {
    try {
      await addDoc(collection(db, 'simulations'), data);
      return true;
    } catch (e) {
      console.warn('Cloud sync error, kept in local storage', e);
    }
  }

  return true;
}

export async function persistRfq(data: RfqPayload): Promise<boolean> {
  try {
    const existing = JSON.parse(localStorage.getItem('biopack_rfqs') || '[]');
    existing.unshift(data);
    localStorage.setItem('biopack_rfqs', JSON.stringify(existing.slice(0, 30)));
  } catch (err) {
    console.error('LocalStorage write error', err);
  }

  if (isFirebaseConnected && db) {
    try {
      await addDoc(collection(db, 'rfqs'), data);
      return true;
    } catch (e) {
      console.warn('Cloud sync error, kept in local storage', e);
    }
  }

  return true;
}

export function getLocalRfqs(): RfqPayload[] {
  try {
    return JSON.parse(localStorage.getItem('biopack_rfqs') || '[]');
  } catch {
    return [];
  }
}
