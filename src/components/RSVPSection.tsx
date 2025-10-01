import React, { useState, useEffect, FC } from 'react';
import { signInAnonymously, onAuthStateChanged, User } from 'firebase/auth'; 
import { auth, db } from '../firebase/config';
import { 
    collection, query, onSnapshot, addDoc, 
    Timestamp, orderBy, CollectionReference, DocumentData, 
    deleteDoc, doc 
} from 'firebase/firestore'; 

// --- Tipe Data untuk RSVP ---
interface RsvpData {
    id: string; 
    name: string;
    attendance: 'yes' | 'no' | 'maybe';
    message: string;
    createdAt: Timestamp | null;
    userId: string;
}

// Konstanta untuk batas tampilan awal dan langkah pemuatan
const INITIAL_LIMIT = 5; // <--- DIUBAH MENJADI 5
const LOAD_MORE_STEP = 5;  // <--- DIUBAH MENJADI 5

// Komponen Utama Aplikasi
const RSVPSection: FC = () => {
    // --- State Management ---
    const [guestName, setGuestName] = useState<string>('');
    const [attendance, setAttendance] = useState<'yes' | 'no' | ''>('');
    const [messages, setMessages] = useState<RsvpData[]>([]); 
    const [message, setMessage] = useState<string>('');
    const [userId, setUserId] = useState<string | null>(null); 
    const [isAuthReady, setIsAuthReady] = useState<boolean>(false);
    const [submitStatus, setSubmitStatus] = useState<string>('Menghubungkan ke database...');
    const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(true);
    const [displayLimit, setDisplayLimit] = useState(INITIAL_LIMIT); // State untuk mengontrol batas tampilan

    const PUBLIC_COLLECTION_PATH = `rsvps`;

    // UTILITY: Mengambil nilai 'to' dari URL
    const getGuestNameFromUrl = (): string => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const name = params.get('to');
            return name ? decodeURIComponent(name.replace(/\+/g, ' ')) : '';
        }
        return '';
    };

    // Fungsi Otentikasi dan Pengaturan State
    const handleAuth = async (initialUser: User | null) => {
        try {
            let user: User | null = initialUser;
            if (!user) {
                const result = await signInAnonymously(auth);
                user = result.user;
            }
            if (user) {
                setUserId(user.uid);
                setSubmitStatus("Tersambung dan siap.");
            } else {
                setSubmitStatus("Error: Gagal otentikasi.");
            }
        } catch (error) {
            console.error("Firebase authentication error:", error);
            setSubmitStatus("Error: Gagal otentikasi. Cek konfigurasi Firebase Auth.");
        } finally {
            setIsAuthReady(true);
        }
    };

    // 1. Otentikasi, Mendapatkan UserId, dan Mengisi Nama Tamu
    useEffect(() => {
        const urlName = getGuestNameFromUrl();
        if (urlName) {
            setGuestName(urlName);
        }
        if (!auth) {
            setSubmitStatus("Error: Firebase Auth tidak diinisialisasi.");
            setIsAuthReady(true);
            return;
        }
        let isMounted = true; 
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!isMounted) return;
            if (!isAuthReady) { 
                handleAuth(user);
            }
        });
        return () => {
            isMounted = false;
            unsubscribe();
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 2. Mendengarkan Pesan Secara Real-time (onSnapshot)
    useEffect(() => {
        if (!isAuthReady || !db) return;
        
        setIsLoadingMessages(true);
        setSubmitStatus("Memuat ucapan...");

        try {
            const rsvpsCol = collection(db, PUBLIC_COLLECTION_PATH) as CollectionReference<DocumentData>;
            const q = query(rsvpsCol, orderBy('createdAt', 'desc')); 

            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const fetchedMessages: RsvpData[] = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    fetchedMessages.push({
                        id: doc.id,
                        name: data.name || 'Anonim',
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
                console.error("Error mendengarkan koleksi RSVP:", error);
                setIsLoadingMessages(false);
                setSubmitStatus("Error: Gagal memuat pesan real-time. Cek aturan 'read'.");
            });

            return () => unsubscribe();

        } catch (error) {
            console.error("Error setting up onSnapshot:", error);
            setIsLoadingMessages(false);
            setSubmitStatus("Error: Gagal menyiapkan listener database.");
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthReady]); 

    // --- FUNGSI UNTUK LOAD MORE/VIEW LESS ---
    const handleLoadMore = () => {
        setDisplayLimit((prevLimit: number) => prevLimit + LOAD_MORE_STEP); 
    };

    const handleViewLess = () => {
        setDisplayLimit(INITIAL_LIMIT); 
    };

    // Ambil pesan yang akan ditampilkan
    const messagesToDisplay = messages.slice(0, displayLimit);
    const hasMoreMessages = messages.length > displayLimit;
    const isExpanded = displayLimit > INITIAL_LIMIT;


    // 3. Handler Pengiriman Formulir (Create)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!userId || !db) {
            console.error("Pengiriman dibatalkan. userId:", userId, "isAuthReady:", isAuthReady); 
            setSubmitStatus("Otentikasi belum selesai. Mohon tunggu 'Connecting...' hilang dan coba lagi.");
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
                userId: userId,
                attendance: attendance as 'yes' | 'no' | 'maybe',
                guests: 1, 
                message: message.trim(),
                createdAt: Timestamp.now(), 
            };
            
            await addDoc(rsvpsCol, newRsvpData);

            if (!getGuestNameFromUrl()) {
                setGuestName(''); 
            }
            setAttendance('');
            setMessage('');
            setSubmitStatus("Berhasil Dikirim! Terima kasih. Ucapan Anda akan segera muncul.");

        } catch (error) {
            console.error("Error menambahkan dokumen:", error);
            setSubmitStatus(`Error mengirim: Gagal menyimpan data. Cek lagi aturan 'create' Firestore. Detail: ${(error as Error).message}`); 
        }
    };
    
    // 4. Handler Penghapusan Pesan (Delete)
    const handleDeleteMessage = async (messageId: string) => { 
        if (!userId || !db) {
            setSubmitStatus("Pengguna belum terautentikasi.");
            return;
        }

        if (window.confirm("Apakah Anda yakin ingin menghapus ucapan Anda? Tindakan ini tidak dapat dibatalkan.")) {
            setSubmitStatus("Menghapus pesan...");
            try {
                const messageRef = doc(db, PUBLIC_COLLECTION_PATH, messageId);
                
                await deleteDoc(messageRef); 

                setSubmitStatus("Pesan berhasil dihapus.");
            } catch (error) {
                console.error("Error menghapus dokumen:", error);
                setSubmitStatus(`Error menghapus: Gagal menghapus data. Anda hanya bisa menghapus pesan milik Anda.`); 
            }
        }
    };

    // Utilitas untuk format timestamp
    const formatTimestamp = (timestamp: Timestamp | null): string => { 
        if (!timestamp) return 'Baru saja';
        try {
            const date = timestamp.toDate();
            return date.toLocaleString('id-ID', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        } catch (e) {
            return 'Baru saja';
        }
    };
    
    // UI Rendering
    return (
        <div className="min-h-screen">
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Markazi+Text:wght@400..700&family=Inter:wght@100..900&display=swap');
                    .font-markazi {
                        font-family: 'Markazi Text', serif;
                        font-optical-sizing: auto;
                        font-weight: 500;
                    }
                    * {
                        font-family: 'Inter', sans-serif;
                    }
                `}
            </style>
            
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            
            <section className="py-12 md:py-20 bg-[#90a4ae] min-h-screen flex items-center justify-center"> 
                <div className="container mx-auto px-4 w-full max-w-4xl">
                    
                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="mb-4">
                        <img 
                            src="/assets/images/doa.png" 
                            alt="Doa" 
                            className="mx-auto max-w-[200px] md:max-w-[280px]"
                            onError={(e) => e.currentTarget.style.display = 'none'} 
                        />
                        </div>
                        
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
                    
                    {/* Form Card */}
                    <div 
                        className="max-w-2xl mx-auto bg-white p-6 md:p-10 rounded-xl shadow-2xl"
                    >
                        <h1 className="font-bold text-gray-700 mb-6 text-center font-markazi text-3xl md:text-4xl">Konfirmasi & Ucapan</h1>
                        <form onSubmit={handleSubmit}>
                            {/* Nama */}
                            <div className="mb-6">
                                <label htmlFor="name" className="block text-gray-700 mb-2 font-semibold text-sm md:text-base font-markazi">
                                    Nama Anda
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={guestName}
                                    onChange={(e) => setGuestName(e.target.value)}
                                    // Membuat input read-only jika nama berasal dari URL
                                    readOnly={getGuestNameFromUrl() !== ''} 
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#455a64] text-sm md:text-base text-black transition disabled:bg-gray-100"
                                    placeholder="Tamu Undangan"
                                    required
                                />
                                {getGuestNameFromUrl() !== '' && (
                                    <p className="text-xs text-gray-500 mt-1">Nama ini diambil dari link undangan.</p>
                                )}
                            </div>
                            
                            {/* Attendance */}
                            <div className="mb-6">
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
                                            className="mr-2 h-5 w-5 text-[#455a64] border-gray-300 focus:ring-[#455a64]"
                                            required
                                        />
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
                                            className="mr-2 h-5 w-5 text-[#455a64] border-gray-300 focus:ring-[#455a64]"
                                            required
                                        />
                                        <label htmlFor="attending-no" className="text-gray-700 text-sm md:text-base font-markazi">
                                            Tidak, saya tidak akan hadir.
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Pesan */}
                            <div className="mb-8">
                                <label htmlFor="message" className="block text-gray-700 mb-2 font-semibold text-sm md:text-base font-markazi"> 
                                    Pesan (Ucapan & Doa)
                                </label>
                                <textarea
                                    id="message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#455a64] text-sm md:text-base text-black transition"
                                    placeholder="Bagikan Ucapan Kepada Mempelai" 
                                    required
                                ></textarea>
                            </div>

                            {/* Tombol Submit */}
                            <button
                                type="submit"
                                disabled={!isAuthReady || !userId} 
                                className="w-full bg-[#455a64] hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                            >
                                {isAuthReady && userId ? "Kirim Ucapan dan Doa" : "Connecting..."}
                            </button>
                        </form>
                    </div>

                    {/* Daftar Ucapan */}
                    {(messages.length > 0 || isLoadingMessages) && (
                        <div className="max-w-2xl mx-auto mt-12">
                            <h3 className="text-3xl font-bold text-white mb-6 text-center font-markazi">
                                Ucapan & Doa Restu ({messages.length})
                            </h3>
                            
                            {isLoadingMessages && messages.length === 0 ? (
                                <div className='text-center text-white text-lg font-medium'>Memuat ucapan...</div>
                            ) : (
                                <ul className="space-y-4 p-2"> 
                                    {/* Menggunakan messagesToDisplay (hanya 5 atau lebih) */}
                                    {messagesToDisplay.map((msg: RsvpData) => ( 
                                        <li key={msg.id} className="bg-white p-5 rounded-xl shadow-xl border-t-8 border-[#455a64]/80">
                                            <div className='flex justify-between items-start mb-2'>
                                                <p className="font-bold text-xl text-[#455a64] font-markazi">
                                                    {msg.name} 
                                                </p>
                                                <span className={`ml-4 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider ${msg.attendance === 'yes' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {msg.attendance === 'yes' ? 'Hadir' : (msg.attendance === 'no' ? 'Tidak Hadir' : 'Maybe')}
                                                </span>
                                            </div>
                                            
                                            <p className="text-gray-700 text-base italic leading-relaxed mb-3 font-markazi">
                                                "{msg.message}"
                                            </p>
                                            
                                            <div className='flex justify-between items-center border-t pt-2'>
                                                
                                                {/* KONTROL KONDISIONAL: Tombol HAPUS hanya muncul untuk pemilik pesan */}
                                                {msg.userId === userId && (
                                                    <button 
                                                        onClick={() => handleDeleteMessage(msg.id)}
                                                        className='text-xs text-red-600 hover:text-red-800 font-semibold transition'
                                                    >
                                                        Hapus Pesan Saya
                                                    </button>
                                                )}

                                                {/* Timestamp */}
                                                <p className={`text-xs text-gray-500 text-right ${msg.userId === userId ? '' : 'w-full'}`}>
                                                    {formatTimestamp(msg.createdAt)}
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {/* KONTROL TOMBOL DI BAWAH LIST */}
                            {(hasMoreMessages || isExpanded) && ( 
                                <div className='text-center mt-6 flex justify-center space-x-4'>
                                    
                                    {/* TOMBOL "LIHAT LEBIH SEDIKIT" */}
                                    {isExpanded && (
                                        <button
                                            onClick={handleViewLess}
                                            className="bg-gray-200 text-[#455a64] hover:bg-gray-300 font-medium py-2 px-4 rounded-lg transition duration-300 shadow-md"
                                        >
                                            Lihat Lebih Sedikit ({INITIAL_LIMIT})
                                        </button>
                                    )}

                                    {/* TOMBOL "LOAD MORE" */}
                                    {hasMoreMessages && (
                                        <button
                                            onClick={handleLoadMore}
                                            className="bg-white text-[#455a64] hover:bg-gray-100 font-medium py-2 px-4 rounded-lg transition duration-300 shadow-md"
                                        >
                                            Lihat {Math.min(LOAD_MORE_STEP, messages.length - displayLimit)} Ucapan Lainnya
                                        </button>
                                    )}
                                </div>
                            )}

                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default RSVPSection;