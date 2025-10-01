import React, { useState, useMemo } from 'react';
// Import hooks dari React Router DOM, diasumsikan tersedia di lingkungan Anda

// ==========================================================
// 1. FUNGSI UNTUK MEMBACA PARAMETER URL (useSearchParams Mock)
// ==========================================================

/**
 * Mock hook untuk membaca parameter 'to' dari URL Window.
 * Jika tidak ditemukan, mengembalikan string kosong.
 */
const useGuestNameFromUrl = (): string => {
    // Ambil parameter kueri dari URL saat ini
    const params = new URLSearchParams(window.location.search);
    
    // Ambil nilai dari parameter 'to'
    let guestName = params.get('to') || '';
    
    // Decode (misalnya, 'Milenia+Story' menjadi 'Milenia Story')
    return decodeURIComponent(guestName.replace(/\+/g, ' '));
};


// ==========================================================
// 2. KOMPONEN UTAMA
// ==========================================================

const QRSection: React.FC = () => {
    // Tentukan Nama Pasangan Statis
    const names = {
        bride: "Alya", 
        groom: "Rian", 
    };
    
    const coupleNameForScan = `${names.bride}_${names.groom}`;

    const guestName = useGuestNameFromUrl();
    const [qrError, setQrError] = useState<boolean>(false); 
    
    const uniqueId = useMemo(() => {
        const cleanName = guestName.trim().replace(/[^a-zA-Z0-9]/g, ''); 
        
        if (cleanName) {
            const namePrefix = cleanName.substring(0, 8).toUpperCase();
            const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
            return `${namePrefix}-MLNSTRY-${randomSuffix}`;
        }
        return '';
    }, [guestName]);


    // LOGIKA QR CODE DINAMIS
    const qrCodeData = useMemo(() => {
        const trimmedName = guestName.trim();

        if (trimmedName.length < 1) {
            return {
                url: 'https://placehold.co/200x200/455a64/ffffff?text=Masukkan+Nama',
                text: "E-Ticket belum dimuat. Mohon pastikan link undangan benar.",
                title: "SCAN E-TICKET/LOKASI",
                encodedData: "N/A"
            };
        }
        
        const cleanNameForScan = trimmedName.replace(/\s/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
        const encodedData = `Nama tamu: ${cleanNameForScan} , Undangan Wedding: ${coupleNameForScan}, ID: ${uniqueId}`; 

        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(encodedData)}`;
        
        return {
            url: qrUrl,
            text: `E-Ticket ini dibuat khusus untuk ${trimmedName}. Tunjukkan kode ini saat kedatangan.`,
            title: "E-TICKET TAMU UNDANGAN",
            encodedData: encodedData
        };
    }, [guestName, uniqueId, coupleNameForScan]); 

    // Handler untuk error QR code
    const handleQrError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.onerror = null; 
        e.currentTarget.src = "https://placehold.co/200x200/ff6b6b/ffffff?text=QR+BLOKIR";
        setQrError(true);
    };

    // UI Rendering
    return (
        <div> 
            <style>
                {/* Impor font dari Google Fonts */}
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Markazi+Text:wght@400..700&display=swap');
                    .font-markazi { font-family: 'Markazi Text', serif; }
                `}
            </style>
            
            <section className="p-0 bg-[#90a4ae]"> 
                <div className="container mx-auto px-4 w-full max-w-md">
                    
                    {/* Header Undangan */}
                    <div className="text-center pt-0 pb-4">
                        
                        {/* Mobile 2xl, Desktop 3xl */}
                        <h1 className="text-2xl md:text-3xl font-bold text-white max-w-2xl mx-auto tracking-wider font-markazi">
                            Kepada Yth. {guestName || 'Tamu Undangan'}
                        </h1>
                        {/* Mobile sm, Desktop xl */}
                        <p className="text-sm md:text-xl text-white mt-2 font-markazi">
                            Merupakan suatu kehormatan bagi kami atas kehadiran Anda.
                        </p>
                    </div>

                    {/* QR CODE SECTION - DINAMIS */}
                    <div className="mx-auto text-center p-6 rounded-xl bg-white bg-opacity-90 shadow-lg">
                        {/* Mobile lg, Desktop 2xl */}
                        <h2 className="text-lg md:text-2xl font-bold text-[#455a64] mb-4 font-markazi">
                            {qrCodeData.title}
                        </h2>
                        
                        {/* QR Code Image Dinamis */}
                        <div className="inline-block transition transform hover:scale-105">
                            <img 
                                src={qrCodeData.url} 
                                alt="QR Code Tamu Undangan" 
                                className={`mx-auto w-48 h-48 rounded-lg shadow-xl border-4 ${qrError ? 'border-red-500' : 'border-[#455a64]'}`}
                                onError={handleQrError} // Handler error
                            />
                        </div>
                        
                        {qrError && (
                            <div className='mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm font-semibold'>
                                GAGAL MEMUAT QR: Layanan QR eksternal diblokir. Harap tunjukkan nama tamu di bawah ini.
                            </div>
                        )}
                        
                        {/* PERUBAHAN DI SINI: text-sm (Mobile/Default) dan md:text-base (Desktop) */}
                        <p className="mt-4 text-gray-700 font-medium text-sm md:text-base">
                            {qrCodeData.text}
                        </p>
                        
                        {/* Mobile base, Desktop lg */}
                        <p className="mt-2 text-base md:text-lg font-extrabold text-[#455a64] font-markazi">
                            Nama Tamu: {guestName || 'Tidak Ditemukan'}
                        </p>
                        
                        {/* LOGO BARU DI SINI */}
                        <img 
                            src="/assets/images/logo2.png" 
                            alt="Wedding Logo" 
                            className="mx-auto mt-3 mb-1 w-32 h-auto" 
                            onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = "https://placehold.co/128x128/cccccc/333333?text=LOGO"; 
                            }}
                        />
                    </div>
                    {/* AKHIR QR CODE SECTION */}

                </div>
            </section>
        </div>
    );
};

export default QRSection;