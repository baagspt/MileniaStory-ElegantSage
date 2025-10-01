import { 
    collection, 
    addDoc, 
    getDocs, 
    Timestamp 
} from 'firebase/firestore';

// Variabel global yang disediakan oleh lingkungan Canvas (dideklarasikan untuk TypeScript)
declare const db: any;
declare const __app_id: string;

// --- 1. Definisi Tipe Data (RsvpData) ---
/**
 * Interface untuk data RSVP yang disimpan di Firestore.
 */
export interface RsvpData {
    id?: string; // ID dokumen Firestore (opsional saat membuat)
    name: string;
    email: string; 
    attendance: 'yes' | 'no' | 'maybe';
    guests: number;
    message: string;
    createdAt?: Timestamp; // Waktu pembuatan dokumen
    userId?: string; // ID pengguna yang membuat dokumen
}

// --- 2. Fungsi Menambahkan RSVP (addRSVP) ---
/**
 * Menambahkan dokumen RSVP baru ke koleksi 'rsvps' publik.
 * @param data - Data RSVP yang akan disimpan.
 * @param userId - ID pengguna saat ini untuk identifikasi.
 */
export const addRSVP = async (data: RsvpData, userId: string): Promise<void> => {
    if (!db) {
        throw new Error("Database not initialized.");
    }
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    // Menggunakan path koleksi publik
    const rsvpCollectionRef = collection(db, `artifacts/${appId}/public/data/rsvps`);

    // Memastikan nilai attendance valid sebelum menyimpan
    const attendanceValue = (['yes', 'no', 'maybe'] as const).includes(data.attendance) 
                            ? data.attendance 
                            : 'no';

    try {
        await addDoc(rsvpCollectionRef, {
            ...data,
            attendance: attendanceValue,
            userId: userId, 
            createdAt: Timestamp.now(), 
        });
    } catch (error) {
        console.error("Error adding document to Firestore:", error);
        throw error;
    }
};

// --- 3. Fungsi Mengambil RSVP (getRSVPs) ---
/**
 * Mengambil semua RSVP dari koleksi 'rsvps' publik.
 * @returns Array objek RsvpData.
 */
export const getRSVPs = async (): Promise<RsvpData[]> => {
    if (!db) return [];

    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    const rsvpCollectionRef = collection(db, `artifacts/${appId}/public/data/rsvps`);
    
    try {
        const snapshot = await getDocs(rsvpCollectionRef);
        
        let rsvps: RsvpData[] = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() as RsvpData, // Casting data ke RsvpData
        }));
        
        // Sortir dalam memori (DESC: terbaru di atas) karena menghindari orderBy() di query
        rsvps.sort((a, b) => {
            const timeA = a.createdAt?.toMillis() || 0;
            const timeB = b.createdAt?.toMillis() || 0;
            return timeB - timeA;
        });

        return rsvps;

    } catch (error) {
        console.error("Error fetching messages from Firestore:", error);
        return [];
    }
};
