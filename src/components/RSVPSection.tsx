import React, { useState, useEffect } from 'react';
import { getAuth, signInAnonymously } from 'firebase/auth'; 
import { Timestamp } from 'firebase/firestore'; 
import app from '../firebase/config';
import { addRSVP, getRSVPs } from '../firebase/rsvpService';

// Definisi Interface untuk Pesan
interface Message {
    id: string;
    name: string;
    attendance: 'yes' | 'no';
    message: string;
    timestamp: Timestamp | null; // Menggunakan tipe Timestamp dari Firestore
    userId: string;
}

// Inisialisasi Auth
const auth = getAuth(app);


// Komponen Utama Aplikasi
const RSVPSection: React.FC = () => {
    const [guestName, setGuestName] = useState<string>('');
    const [attendance, setAttendance] = useState<'yes' | 'no' | ''>('');
    // Menggunakan Message[] untuk tipe state messages
    const [messages, setMessages] = useState<Message[]>([]); 
    const [message, setMessage] = useState<string>('');
    const [userId, setUserId] = useState<string | null>(null);
    const [isDbReady, setIsDbReady] = useState<boolean>(false);
    const [submitStatus, setSubmitStatus] = useState<string>('');


    // 1. Otentikasi dan Inisialisasi
    useEffect(() => {
        const authenticate = async () => {
            try {
                await signInAnonymously(auth);
                // Pastikan userId disetel setelah otentikasi
                setUserId(auth.currentUser?.uid || null); 
                setIsDbReady(true);
                
                // Load existing RSVPs
                const rsvps = await getRSVPs();
                setMessages(rsvps.map(rsvp => {
                    // Convert the timestamp properly based on its type
                    let timestamp = null;
                    if (rsvp.createdAt) {
                        if (rsvp.createdAt instanceof Timestamp) {
                            timestamp = rsvp.createdAt;
                        } else if (rsvp.createdAt instanceof Date) {
                            timestamp = Timestamp.fromDate(rsvp.createdAt);
                        } else {
                            // If it's already a Date object from our service, convert to Timestamp
                            timestamp = Timestamp.fromDate(new Date(rsvp.createdAt));
                        }
                    }
                    
                    return {
                        id: rsvp.id || '',
                        name: rsvp.name,
                        attendance: rsvp.attendance as 'yes' | 'no',
                        message: rsvp.message,
                        timestamp,
                        userId: rsvp.email // Using email as identifier in our new service
                    };
                }));
            } catch (error) {
                console.error("Firebase authentication error:", error);
                setSubmitStatus("Error: Gagal terhubung ke database.");
            }
        };

        authenticate();
    }, []);

    // 2. Handler Pengiriman Formulir (Menyimpan ke Firestore)
    // Menambahkan tipe eksplisit untuk event e
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isDbReady) {
            setSubmitStatus("Database belum siap. Mohon tunggu.");
            return;
        }

        if (guestName.trim() === '' || attendance === '' || message.trim() === '') {
            setSubmitStatus("Mohon isi semua kolom yang wajib.");
            return;
        }

        setSubmitStatus("Mengirim...");

        try {
            // Using our new RSVP service
            await addRSVP({
                name: guestName.trim(),
                email: 'anonymous@wedding.com', // Using a default email for anonymous submissions
                attendance: attendance as 'yes' | 'no' | 'maybe', // Adjusting to match our service type
                guests: 1, // Default to 1 guest
                message: message.trim(),
            });

            // Refresh messages after successful submission
            const rsvps = await getRSVPs();
            setMessages(rsvps.map(rsvp => {
                // Convert the timestamp properly based on its type
                let timestamp = null;
                if (rsvp.createdAt) {
                    if (rsvp.createdAt instanceof Timestamp) {
                        timestamp = rsvp.createdAt;
                    } else if (rsvp.createdAt instanceof Date) {
                        timestamp = Timestamp.fromDate(rsvp.createdAt);
                    } else {
                        // If it's already a Date object from our service, convert to Timestamp
                        timestamp = Timestamp.fromDate(new Date(rsvp.createdAt));
                    }
                }
                
                return {
                    id: rsvp.id || '',
                    name: rsvp.name,
                    attendance: rsvp.attendance as 'yes' | 'no',
                    message: rsvp.message,
                    timestamp,
                    userId: rsvp.email
                };
            }));

            // Bersihkan formulir setelah berhasil
            setGuestName('');
            setAttendance('');
            setMessage('');
            setSubmitStatus("Berhasil Dikirim! Terima kasih.");

        } catch (error) {
            console.error("Error menambahkan dokumen:", error);
            setSubmitStatus(`Error mengirim: ${(error as Error).message}`); // Cast error to Error type
        }
    };
    
    // UI Rendering
    return (
        <div className="min-h-screen">
            <style>
                {/* Impor font dari Google Fonts */}
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Markazi+Text:wght@400..700&display=swap');
                `}
            </style>
            {/* Latar belakang keseluruhan dipertahankan (#90a4ae) */}
            <section className="py-12 md:py-20 bg-[#90a4ae] min-h-screen flex items-center justify-center"> 
                <div className="container mx-auto px-4 w-full">
                    
                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="mb-4">
                        <img 
                            src="/assets/images/doa.png" 
                            alt="Doa" 
                            className="mx-auto max-w-[200px] md:max-w-[280px]"
                        />
                    </div>
                        
                        {/* Teks konfirmasi diubah menjadi putih (text-white) */}
                        <p className="text-l text-white max-w-2xl mx-auto tracking-wider" style={{fontFamily: "Markazi Text, serif"}}>
                            Tolong konfrimasi sebelum tanggal 02 Februari 2025
                        </p>
                    </div>

                    {/* Status Message */}
                    {submitStatus && (
                        <div className={`max-w-2xl mx-auto mb-4 p-4 rounded-lg text-center font-medium ${submitStatus.startsWith('Error') ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                            {submitStatus}
                        </div>
                    )}
                    
                    {/* Debugging: Show User ID */}
                    <p className="text-sm text-center text-white mb-6">
                        User ID: <span className='font-mono bg-white bg-opacity-10 p-1 rounded-md'>{userId ? userId : 'Connecting...'}</span>
                    </p>


                    {/* Form Card */}
                    <div 
                        // Latar belakang card: putih (bg-white)
                        className="max-w-2xl mx-auto bg-white p-6 md:p-10 rounded-xl shadow-2xl"
                    >
                        <h1 className="font-bold text-gray-700 mb-6 text-center font-markazi">Konfirmasi & Ucapan</h1>
                        <form onSubmit={handleSubmit}>
                            {/* Nama */}
                            <div className="mb-6">
                                {/* PERUBAHAN LABEL DI SINI */}
                                <label htmlFor="name" className="block text-gray-700 mb-2 font-semibold text-sm md:text-base" style={{fontFamily: "Markazi Text, serif"}}>
                                    Nama Anda
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={guestName}
                                    onChange={(e) => setGuestName(e.target.value)}
                                    // PERUBAHAN INPUT DI SINI (memengaruhi placeholder dan teks yang diketik)
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#455a64] text-sm md:text-base text-black transition"
                                    placeholder="Tamu Undangan"
                                    required
                                />
                            </div>
                            
                            {/* Attendance */}
                            <div className="mb-6">
                                {/* PERUBAHAN P DI SINI */}
                                <p className="text-gray-700 mb-3 font-semibold text-sm md:text-base" style={{fontFamily: "Markazi Text, serif"}}>Apakah anda akan hadir?</p>
                                <div className="flex space-x-6">
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
                                        {/* PERUBAHAN LABEL RADIO DI SINI */}
                                        <label htmlFor="attending-yes" className="text-gray-700 text-sm md:text-base" style={{fontFamily: "Markazi Text, serif"}}>
                                            Ya, saya akan hadir.
                                        </label>
                                    </div>
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
                                        {/* PERUBAHAN LABEL RADIO DI SINI */}
                                        <label htmlFor="attending-no" className="text-gray-700 text-sm md:text-base" style={{fontFamily: "Markazi Text, serif"}}>
                                            Tidak, saya tidak akan hadir.
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Pesan */}
                            <div className="mb-8">
                                {/* PERUBAHAN LABEL DI SINI */}
                                <label htmlFor="message" className="block text-gray-700 mb-2 font-semibold text-sm md:text-base" style={{fontFamily: "Markazi Text, serif"}}> 
                                    Pesan (Ucapan & Doa)
                                </label>
                                <textarea
                                    id="message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    rows={4}
                                    // PERUBAHAN TEXTAREA DI SINI (memengaruhi placeholder dan teks yang diketik)
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#455a64] text-sm md:text-base text-black transition"
                                    placeholder="Bagikan Ucapan Kepada Mempelai" 
                                    required
                                ></textarea>
                            </div>

                            {/* Tombol */}
                            <button
                                type="submit"
                                disabled={!isDbReady}
                                // Warna tombol #455a64 (default) dan hover gray-700
                                className="w-full bg-[#455a64] hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                            >
                                {isDbReady ? "Kirim Ucapan dan Doa" : "Connecting..."}
                            </button>
                        </form>
                    </div>

                    {/* Daftar Ucapan */}
                    {messages.length > 0 && (
                        <div className="max-w-2xl mx-auto mt-12">
                            {/* Judul Messages diubah menjadi putih (text-white) */}
                            <h3 className="text-3xl font-bold text-white mb-6 text-center" style={{fontFamily: "Markazi Text, serif"}}>
                                Ucapan & Doa Restu ({messages.length})
                            </h3>
                            <ul className="space-y-4">
                                {messages.map((msg) => (
                                    <li key={msg.id} className="bg-white p-5 rounded-xl shadow-xl border-t-8 border-[#455a64]/80">
                                        <div className='flex justify-between items-start mb-2'>
                                            <p className="font-bold text-xl text-[#455a64]" style={{fontFamily: "Markazi Text, serif"}}>
                                                {msg.name} 
                                            </p>
                                            <span className={`ml-4 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider ${msg.attendance === 'yes' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {msg.attendance === 'yes' ? 'Hadir' : 'Tidak Hadir'}
                                            </span>
                                        </div>
                                        
                                        <p className="text-gray-700 text-base italic leading-relaxed mb-3" style={{fontFamily: "Markazi Text, serif"}}>
                                            "{msg.message}"
                                        </p>
                                        
                                        <p className="text-xs text-gray-500 mt-2 text-right border-t pt-2">
                                            {/* Menampilkan waktu pengiriman */}
                                            {msg.timestamp ? new Date(msg.timestamp.toMillis()).toLocaleString() : 'Baru saja'}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default RSVPSection;