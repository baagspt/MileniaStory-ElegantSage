import React, { useState, useEffect } from 'react';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth'; 
import { auth, db } from '../firebase/config';
// Impor Firestore baru yang diperlukan untuk real-time dan penulisan data
import { collection, query, onSnapshot, addDoc, Timestamp, orderBy, CollectionReference, DocumentData } from 'firebase/firestore'; 

// --- Tipe Data untuk RSVP ---
interface RsvpData {
    id: string; // Diperoleh dari Firestore Document ID
    name: string;
    attendance: 'yes' | 'no' | 'maybe';
    message: string;
    createdAt: Timestamp | null;
    userId: string; // ID pengguna yang membuat pesan
}

// Komponen Utama Aplikasi
const RSVPSection: React.FC = () => {
    const [guestName, setGuestName] = useState<string>('');
    const [attendance, setAttendance] = useState<'yes' | 'no' | ''>('');
    const [messages, setMessages] = useState<RsvpData[]>([]); 
    const [message, setMessage] = useState<string>('');
    const [userId, setUserId] = useState<string | null>(null);
    const [isAuthReady, setIsAuthReady] = useState<boolean>(false);
    const [submitStatus, setSubmitStatus] = useState<string>('Menghubungkan ke database...');
    const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(true);

    // Path publik untuk data yang dibagikan antar pengguna (misal: ucapan)
    const PUBLIC_COLLECTION_PATH = `rsvps`;

    // 1. Otentikasi dan Mendapatkan UserId
    useEffect(() => {
        if (!auth) {
            setSubmitStatus("Error: Firebase Auth tidak diinisialisasi.");
            setIsAuthReady(true);
            return;
        }

        let isMounted = true; // Untuk mencegah state update pada komponen yang sudah unmount

        // Listener status autentikasi untuk mendapatkan UID pengguna
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!isMounted) return; // Pastikan komponen masih mounted
            
            if (user) {
                // User sudah terautentikasi (melalui token atau anonim)
                setUserId(user.uid);
                setSubmitStatus("Tersambung dan siap.");
                setIsAuthReady(true);
            } else {
                // Coba sign in secara anonim
                try {
                    await signInAnonymously(auth); 
                } catch (error) {
                    console.error("Firebase authentication error:", error);
                    setSubmitStatus("Error: Gagal otentikasi. Cek konfigurasi Firebase.");
                    // Fallback ke UUID acak (mendukung browser lama)
                    setUserId(typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15));
                } finally {
                    if (isMounted) {
                        setIsAuthReady(true);
                    }
                }
            }
        });

        // Cleanup listener
        return () => {
            isMounted = false;
            unsubscribe();
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 2. Mendengarkan Pesan Secara Real-time (onSnapshot)
    useEffect(() => {
        // Hanya jalankan jika otentikasi siap dan database terinisialisasi
        if (!isAuthReady || !db) return;
        
        setIsLoadingMessages(true);
        setSubmitStatus("Memuat ucapan...");

        try {
            // Membuat query: Ambil data dari koleksi publik, urutkan berdasarkan waktu buat terbaru
            const rsvpsCol = collection(db, PUBLIC_COLLECTION_PATH) as CollectionReference<DocumentData>;
            const q = query(rsvpsCol, orderBy('createdAt', 'desc'));

            // Menggunakan onSnapshot untuk real-time update
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const fetchedMessages: RsvpData[] = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    fetchedMessages.push({
                        id: doc.id,
                        name: data.name || 'Anonim',
                        attendance: (data.attendance as 'yes' | 'no' | 'maybe') || 'maybe',
                        message: data.message || 'Tidak ada pesan',
                        createdAt: data.createdAt instanceof Timestamp ? data.createdAt : null,
                        userId: data.userId || 'unknown',
                    });
                });

                setMessages(fetchedMessages);
                setIsLoadingMessages(false);
                if (!submitStatus.toLowerCase().includes('error')) {
                    setSubmitStatus(`Tersambung, ${fetchedMessages.length} ucapan dimuat.`);
                }
            }, (error) => {
                // Error handling untuk onSnapshot
                console.error("Error mendengarkan koleksi RSVP:", error);
                setIsLoadingMessages(false);
                setSubmitStatus("Error: Gagal memuat pesan real-time.");
            });

            // Cleanup function
            return () => unsubscribe();

        } catch (error) {
            console.error("Error setting up onSnapshot:", error);
            setIsLoadingMessages(false);
            setSubmitStatus("Error: Gagal menyiapkan listener database.");
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthReady]); // Dependensi: isAuthReady

    // 3. Handler Pengiriman Formulir
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!userId || !db) {
            setSubmitStatus("Database belum siap. Mohon tunggu.");
            return;
        }

        if (guestName.trim() === '' || attendance === '' || message.trim() === '') {
            setSubmitStatus("Mohon isi semua kolom yang wajib.");
            return;
        }

        setSubmitStatus("Mengirim...");

        try {
            const rsvpsCol = collection(db, PUBLIC_COLLECTION_PATH);

            const newRsvpData = {
                name: guestName.trim(),
                userId: userId, // ID unik dari Auth
                attendance: attendance as 'yes' | 'no' | 'maybe',
                guests: 1, // Diabaikan dalam UI ini, tapi penting untuk data
                message: message.trim(),
                createdAt: Timestamp.now(), // Tambahkan timestamp server
            };

            await addDoc(rsvpsCol, newRsvpData);

            // Reset formulir setelah berhasil
            setGuestName('');
            setAttendance('');
            setMessage('');
            setSubmitStatus("Berhasil Dikirim! Terima kasih.");

        } catch (error) {
            console.error("Error menambahkan dokumen:", error);
            setSubmitStatus(`Error mengirim: Gagal menyimpan data. ${(error as Error).message}`); 
        }
    };

    // Utilitas untuk format timestamp
    const formatTimestamp = (timestamp: Timestamp | null): string => {
        if (!timestamp) return 'Baru saja';
        try {
            const date = timestamp.toDate();
            // Format Indonesia: DD/MM/YYYY HH:MM
            return date.toLocaleString('id-ID', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        } catch (e) {
            return 'Baru saja';
        }
    };
    
    // UI Rendering
    return (
        <div className="min-h-screen">
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Markazi+Text:wght@400..700&family=Inter:wght@100..900&display=swap');

                    /* Font untuk judul dan elemen dekoratif */
                    .font-markazi {
                        font-family: 'Markazi Text', serif;
                        font-optical-sizing: auto;
                        font-weight: 500;
                    }
                    /* Font default untuk teks biasa */
                    * {
                        font-family: 'Inter', sans-serif;
                    }
                    /* Custom scrollbar untuk tampilan yang lebih baik */
                    .scroll-container::-webkit-scrollbar {
                        width: 8px;
                    }
                    .scroll-container::-webkit-scrollbar-thumb {
                        background-color: #607d8b; /* Warna abu-abu kebiruan */
                        border-radius: 4px;
                    }
                `}
            </style>
            
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            
            {/* Background utama abu-abu kebiruan */}
            <section className="py-12 md:py-20 bg-[#90a4ae] min-h-screen flex items-center justify-center"> 
                <div className="container mx-auto px-4 w-full max-w-4xl">
                    
                    <div className="text-center mb-10">
                        <div className="mb-4">
                            {/* Placeholder/Icon untuk Doa Restu */}
                            <img 
                                src="https://placehold.co/280x80/607d8b/ffffff?text=Doa+Restu" 
                                alt="Doa Restu Placeholder" 
                                className="mx-auto max-w-[200px] md:max-w-[280px] rounded-lg shadow-lg"
                                onError={(e) => e.currentTarget.style.display = 'none'}
                            />
                        </div>
                        
                        <p className="text-xl text-white max-w-2xl mx-auto tracking-wider font-markazi text-3xl md:text-4xl leading-snug">
                            Tolooong konfirmasi kehadiran sebelum tanggal 02 Februari 2025
                        </p>
                    </div>

                    {/* Status Message */}
                    {submitStatus && (
                        <div className={`max-w-2xl mx-auto mb-6 p-4 rounded-xl text-center font-semibold text-base md:text-lg ${submitStatus.toLowerCase().includes('error') ? 'bg-red-500 text-white shadow-xl' : 'bg-green-500 text-white shadow-xl'}`}>
                            {submitStatus}
                        </div>
                    )}
                    
                    {/* User ID */}
                    <div className='text-center mb-8'>
                        <p className="text-xs text-center text-white opacity-80 mb-1">
                            ID Sesi (Publik):
                        </p>
                        <p className='font-mono bg-white bg-opacity-10 p-2 rounded-md inline-block text-white text-xs break-all shadow-md'>
                            {userId ? userId : 'Connecting...'}
                        </p>
                    </div>


                    {/* Form Card */}
                    <div 
                        className="max-w-2xl mx-auto bg-white p-6 md:p-10 rounded-xl shadow-2xl border-t-8 border-[#455a64]"
                    >
                        <h1 className="font-bold text-gray-700 mb-8 text-center font-markazi text-4xl">Konfirmasi & Ucapan</h1>
                        <form onSubmit={handleSubmit}>
                            {/* Nama */}
                            <div className="mb-6">
                                <label htmlFor="name" className="block text-gray-700 mb-2 font-semibold text-xl font-markazi">
                                    Nama Anda
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={guestName}
                                    onChange={(e) => setGuestName(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#455a64] text-base text-gray-800 transition shadow-inner"
                                    placeholder="Masukkan Nama Anda"
                                    required
                                />
                            </div>
                            
                            {/* Attendance */}
                            <div className="mb-6">
                                <p className="text-gray-700 mb-3 font-semibold text-xl font-markazi">Apakah anda akan hadir?</p>
                                <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-3 sm:space-y-0">
                                    {/* Ya */}
                                    <label htmlFor="attending-yes" className="flex items-center bg-gray-50 p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition duration-150 cursor-pointer w-full sm:w-1/2">
                                        <input
                                            type="radio"
                                            id="attending-yes"
                                            name="attendance"
                                            value="yes"
                                            checked={attendance === 'yes'}
                                            onChange={() => setAttendance('yes')}
                                            className="mr-3 h-5 w-5 text-[#455a64] border-gray-300 focus:ring-[#455a64] checked:bg-[#455a64] checked:border-transparent"
                                            required
                                        />
                                        <span className="text-gray-700 text-lg font-markazi">
                                            Ya, saya akan hadir.
                                        </span>
                                    </label>
                                    {/* Tidak */}
                                    <label htmlFor="attending-no" className="flex items-center bg-gray-50 p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition duration-150 cursor-pointer w-full sm:w-1/2">
                                        <input
                                            type="radio"
                                            id="attending-no"
                                            name="attendance"
                                            value="no"
                                            checked={attendance === 'no'}
                                            onChange={() => setAttendance('no')}
                                            className="mr-3 h-5 w-5 text-[#455a64] border-gray-300 focus:ring-[#455a64] checked:bg-[#455a64] checked:border-transparent"
                                            required
                                        />
                                        <span className="text-gray-700 text-lg font-markazi">
                                            Tidak, saya tidak akan hadir.
                                        </span>
                                    </label>
                                </div>
                            </div>

                            {/* Pesan */}
                            <div className="mb-8">
                                <label htmlFor="message" className="block text-gray-700 mb-2 font-semibold text-xl font-markazi"> 
                                    Pesan (Ucapan & Doa)
                                </label>
                                <textarea
                                    id="message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#455a64] text-base text-gray-800 transition shadow-inner"
                                    placeholder="Bagikan Ucapan Kepada Mempelai" 
                                    required
                                ></textarea>
                            </div>

                            {/* Tombol */}
                            <button
                                type="submit"
                                // Tombol dinonaktifkan jika otentikasi belum siap atau userId belum ada
                                disabled={!isAuthReady || isLoadingMessages || !userId} 
                                className="w-full bg-[#455a64] hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl text-lg"
                            >
                                {isAuthReady && !isLoadingMessages && userId ? "Kirim Ucapan dan Doa" : "Menghubungkan..."}
                            </button>
                        </form>
                    </div>

                    {/* Daftar Ucapan */}
                    <div className="max-w-2xl mx-auto mt-12">
                        <h3 className="text-4xl font-bold text-white mb-8 text-center font-markazi">
                            Ucapan & Doa Restu ({messages.length})
                        </h3>
                        {isLoadingMessages && messages.length === 0 ? (
                            <p className="text-center text-white p-4 bg-gray-700 bg-opacity-30 rounded-xl shadow-lg">Memuat pesan...</p>
                        ) : (
                            <ul className="space-y-6 max-h-[500px] overflow-y-auto scroll-container">
                                {messages.map((msg) => (
                                    <li key={msg.id} className="bg-white p-5 rounded-xl shadow-2xl border-l-8 border-[#455a64] break-words">
                                        <div className='flex justify-between items-start mb-2'>
                                            <p className="font-bold text-2xl text-[#455a64] font-markazi leading-none">
                                                {msg.name} 
                                            </p>
                                            <span className={`ml-4 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm ${msg.attendance === 'yes' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {msg.attendance === 'yes' ? 'Hadir' : 'Tidak Hadir'}
                                            </span>
                                        </div>
                                        
                                        <p className="text-gray-700 text-lg italic leading-relaxed mb-3 font-markazi whitespace-pre-wrap">
                                            "{msg.message}"
                                        </p>
                                        
                                        <p className="text-xs text-gray-500 mt-3 text-right border-t pt-2">
                                            {formatTimestamp(msg.createdAt)}
                                        </p>
                                    </li>
                                ))}
                                {messages.length === 0 && !isLoadingMessages && (
                                    <p className="text-center text-white p-4 bg-gray-700 bg-opacity-30 rounded-xl shadow-lg font-semibold">Belum ada ucapan. Jadilah yang pertama!</p>
                                )}
                            </ul>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default RSVPSection;
