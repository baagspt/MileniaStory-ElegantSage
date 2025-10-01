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
                        // Memastikan tipe attendance sesuai, fallback ke 'maybe' jika tidak valid
                        attendance: (['yes', 'no'].includes(data.attendance) ? data.attendance : 'maybe') as 'yes' | 'no' | 'maybe',
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
                guests: 1, // Default guest count
                message: message.trim(),
                createdAt: Timestamp.now(), // Tambahkan timestamp server
            };

            await addDoc(rsvpsCol, newRsvpData);

            // Reset formulir setelah berhasil
            setGuestName('');
            setAttendance('');
            setMessage('');
            // Karena onSnapshot aktif, pesan akan otomatis ter-update.
            setSubmitStatus("Berhasil Dikirim! Terima kasih. Ucapan Anda akan segera muncul.");

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
            // Format Indonesia: Tgl Bln Thn, Jam:Menit
            return date.toLocaleString('id-ID', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        } catch (e) {
            return 'Baru saja';
        }
    };
    
    // UI Rendering
    return (
        <div className="min-h-screen">
            {/* Hapus script tag tailwind.css di sini jika Anda menggunakan framework yang sudah terintegrasi */}
            {/* <script src="https://cdn.tailwindcss.com"></script> */}
            <style>
                {/* Impor font dari Google Fonts */}
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Markazi+Text:wght@400..700&family=Inter:wght@100..900&display=swap');

                    /* Font untuk judul dan elemen dekoratif - Diubah ke Markazi Text */
                    .font-markazi {
                        font-family: 'Markazi Text', serif;
                        font-optical-sizing: auto;
                        font-weight: 500; /* Disesuaikan agar tebal */
                    }
                    /* Font default untuk teks biasa - Diubah ke Inter */
                    * {
                        font-family: 'Inter', sans-serif;
                    }

                    /* Menggantikan semua style inline style={{fontFamily: "Markazi Text, serif"}} dengan class 'font-markazi' jika sesuai konteks */
                `}
            </style>
            
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            
            {/* Latar belakang keseluruhan dipertahankan (#90a4ae) */}
            <section className="py-12 md:py-20 bg-[#90a4ae] min-h-screen flex items-center justify-center"> 
                <div className="container mx-auto px-4 w-full max-w-4xl">
                    
                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="mb-4">
                        {/* Menggunakan URL/Path gambar dari skrip pertama */}
                        <img 
                            src="/assets/images/doa.png" 
                            alt="Doa" 
                            className="mx-auto max-w-[200px] md:max-w-[280px]"
                            onError={(e) => e.currentTarget.style.display = 'none'} // Fallback jika gambar tidak ditemukan
                        />
                        </div>
                        
                        {/* Teks konfirmasi diubah menjadi putih (text-white) & menggunakan style skrip pertama */}
                        <p className="text-l text-white max-w-2xl mx-auto tracking-wider font-markazi">
                            Tolooong konfirmasi kehadiran sebelum tanggal 02 Februari 2025
                        </p>
                    </div>

                    {/* Status Message */}
                    {submitStatus && (
                        <div className={`max-w-2xl mx-auto mb-4 p-4 rounded-lg text-center font-medium text-base ${submitStatus.toLowerCase().includes('error') ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                            {submitStatus}
                        </div>
                    )}
                    
                    {/* User ID - Disesuaikan dengan style skrip pertama */}
                    <p className="text-sm text-center text-white mb-6">
                        User ID: <span className='font-mono bg-white bg-opacity-10 p-1 rounded-md'>{userId ? userId : 'Connecting...'}</span>
                    </p>


                    {/* Form Card */}
                    <div 
                        // Latar belakang card: putih (bg-white), shadow & border disesuaikan
                        className="max-w-2xl mx-auto bg-white p-6 md:p-10 rounded-xl shadow-2xl"
                    >
                        <h1 className="font-bold text-gray-700 mb-6 text-center font-markazi text-3xl md:text-4xl">Konfirmasi & Ucapan</h1>
                        <form onSubmit={handleSubmit}>
                            {/* Nama */}
                            <div className="mb-6">
                                {/* Label menggunakan style skrip pertama */}
                                <label htmlFor="name" className="block text-gray-700 mb-2 font-semibold text-sm md:text-base font-markazi">
                                    Nama Anda
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={guestName}
                                    onChange={(e) => setGuestName(e.target.value)}
                                    // Input menggunakan style skrip pertama
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#455a64] text-sm md:text-base text-black transition"
                                    placeholder="Tamu Undangan"
                                    required
                                />
                            </div>
                            
                            {/* Attendance */}
                            <div className="mb-6">
                                {/* P menggunakan style skrip pertama */}
                                <p className="text-gray-700 mb-3 font-semibold text-sm md:text-base font-markazi">Apakah anda akan hadir?</p>
                                <div className="flex space-x-6">
                                    {/* Ya */}
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            id="attending-yes"
                                            name="attendance"
                                            checked={attendance === 'yes'}
                                            onChange={() => setAttendance('yes')}
                                            // Radio menggunakan style skrip pertama
                                            className="mr-2 h-5 w-5 text-[#455a64] border-gray-300 focus:ring-[#455a64]"
                                            required
                                        />
                                        {/* Label Radio menggunakan style skrip pertama */}
                                        <label htmlFor="attending-yes" className="text-gray-700 text-sm md:text-base font-markazi">
                                            Ya, saya akan hadir.
                                        </label>
                                    </div>
                                    {/* Tidak */}
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            id="attending-no"
                                            name="attendance"
                                            checked={attendance === 'no'}
                                            onChange={() => setAttendance('no')}
                                            // Radio menggunakan style skrip pertama
                                            className="mr-2 h-5 w-5 text-[#455a64] border-gray-300 focus:ring-[#455a64]"
                                            required
                                        />
                                        {/* Label Radio menggunakan style skrip pertama */}
                                        <label htmlFor="attending-no" className="text-gray-700 text-sm md:text-base font-markazi">
                                            Tidak, saya tidak akan hadir.
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Pesan */}
                            <div className="mb-8">
                                {/* Label menggunakan style skrip pertama */}
                                <label htmlFor="message" className="block text-gray-700 mb-2 font-semibold text-sm md:text-base font-markazi"> 
                                    Pesan (Ucapan & Doa)
                                </label>
                                <textarea
                                    id="message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    rows={4}
                                    // Textarea menggunakan style skrip pertama
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#455a64] text-sm md:text-base text-black transition"
                                    placeholder="Bagikan Ucapan Kepada Mempelai" 
                                    required
                                ></textarea>
                            </div>

                            {/* Tombol */}
                            <button
                                type="submit"
                                disabled={!isAuthReady || isLoadingMessages} // Menggunakan isAuthReady dari skrip kedua
                                // Warna tombol #455a64 (default) dan hover gray-700
                                className="w-full bg-[#455a64] hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                            >
                                {isAuthReady ? "Kirim Ucapan dan Doa" : "Connecting..."}
                            </button>
                        </form>
                    </div>

                    {/* Daftar Ucapan */}
                    {(messages.length > 0 || isLoadingMessages) && (
                        <div className="max-w-2xl mx-auto mt-12">
                            {/* Judul Messages diubah menjadi putih (text-white) & menggunakan font-markazi */}
                            <h3 className="text-3xl font-bold text-white mb-6 text-center font-markazi">
                                Ucapan & Doa Restu ({messages.length})
                            </h3>
                            
                            {isLoadingMessages && messages.length === 0 ? (
                                <div className='text-center text-white text-lg font-medium'>Memuat ucapan...</div>
                            ) : (
                                <ul className="space-y-4 max-h-[500px] overflow-y-auto p-2 scroll-container">
                                    {messages.map((msg) => (
                                        // Card Ucapan disesuaikan dengan skrip pertama
                                        <li key={msg.id} className="bg-white p-5 rounded-xl shadow-xl border-t-8 border-[#455a64]/80">
                                            <div className='flex justify-between items-start mb-2'>
                                                <p className="font-bold text-xl text-[#455a64] font-markazi">
                                                    {msg.name} 
                                                </p>
                                                <span className={`ml-4 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider ${msg.attendance === 'yes' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {/* Menampilkan status kehadiran */}
                                                    {msg.attendance === 'yes' ? 'Hadir' : (msg.attendance === 'no' ? 'Tidak Hadir' : 'Maybe')}
                                                </span>
                                            </div>
                                            
                                            <p className="text-gray-700 text-base italic leading-relaxed mb-3 font-markazi">
                                                "{msg.message}"
                                            </p>
                                            
                                            <p className="text-xs text-gray-500 mt-2 text-right border-t pt-2">
                                                {/* Menggunakan utilitas formatTimestamp dari skrip kedua */}
                                                {formatTimestamp(msg.createdAt)}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default RSVPSection;