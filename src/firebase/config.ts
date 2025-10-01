import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; 

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyArcrfaI0SJzfgwOODz4Kqux9xs6YzuGMQ",
  authDomain: "milenia-story.firebaseapp.com",
  projectId: "milenia-story",
  storageBucket: "milenia-story.firebasestorage.app",
  messagingSenderId: "833712284397",
  appId: "1:833712284397:web:1760925c0e7bc63234e2e4",
  measurementId: "G-JMW6QVX9KD"
};

// --- Inisiasi Aplikasi dan Pencegahan Inisiasi Ganda ---

// Pengecekan Kunci (Error Handling Tambahan)
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  // Memberikan error eksplisit jika kunci tidak dimuat dari environment variables
  console.error(
    "FATAL ERROR: Firebase keys are missing!"
  );
  // Dalam lingkungan live, ini akan mencegah aplikasi mencoba inisiasi yang pasti gagal.
}


// Mencegah error "Firebase: Firebase App named '[DEFAULT]' already exists" (app/duplicate-app) 
// yang sering terjadi saat Fast Refresh/Hot Module Replacement (HMR) diaktifkan.
const app: FirebaseApp = getApps().length === 0 
  ? initializeApp(firebaseConfig) 
  : getApps()[0];

// Inisiasi layanan agar siap digunakan
export const db = getFirestore(app);
export const auth = getAuth(app); // Jika Anda menggunakan Auth

// Ekspor instance app
export default app; 
