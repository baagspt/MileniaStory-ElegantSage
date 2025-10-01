import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Variabel Global dari Lingkungan Canvas
declare const __app_id: string | undefined;
declare const __firebase_config: string | undefined;
declare const __initial_auth_token: string | undefined;

// Parsing konfigurasi Firebase
const firebaseConfig = (() => {
    if (typeof __firebase_config === 'string') {
        try {
            return JSON.parse(__firebase_config);
        } catch (e) {
            console.error("Error parsing __firebase_config:", e);
        }
    }
    // Fallback jika tidak ada config (tidak boleh terjadi di Canvas)
    return {};
})();

// Inisialisasi Firebase App
export const app = initializeApp(firebaseConfig);

// Inisialisasi Auth dan Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

// Otentikasi otomatis saat inisialisasi (di Canvas)
// Komponen akan menggunakan signInAnonymously untuk memastikan userId yang konsisten
// Meskipun otentikasi awal ditangani di sini, signInAnonymously di komponen lebih baik untuk mendapatkan UserID
// di dalam scope komponen React.
