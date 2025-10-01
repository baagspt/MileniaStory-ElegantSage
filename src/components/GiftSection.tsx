import React, { useState } from 'react';

// Fungsi untuk menangani penyalinan teks ke clipboard
const copyToClipboard = (text: string, label: string) => {
    // Penggunaan 'alert' sederhana untuk memberikan feedback penyalinan
    navigator.clipboard.writeText(text).then(() => {
        alert(`${label} berhasil disalin!`);
    }).catch(err => {
        console.error('Gagal menyalin:', err);
        alert(`Gagal menyalin ${label}. Silakan salin manual.`);
    });
};

const GiftSection: React.FC = () => {
    // State untuk mengontrol apakah bagian Cashless/Alamat terlihat
    const [isCashlessVisible, setIsCashlessVisible] = useState(false);

    // Warna tombol baru
    const buttonColor = '#414C3D';
    const buttonHoverColor = '#37422F';

    // Data dummy (ganti dengan data sebenarnya)
    const rekeningData = {
        bank: "Bank BCA / QRIS / Seabank",
        nomor: "1234567890",
        atasNama: "Nama Mempelai Pria/Wanita" 
    };
    const alamatData = {
        judul: "Kota Mojokerto, Jawa Timur",
        detail: "Jl. Veteran, Mergelo, Magersari, Kec. Magersari, Kota Mojokerto, Jawa Timur 61324" 
    };

    const handleGiftButtonClick = () => {
        // Toggle visibilitas konten
        setIsCashlessVisible(prev => !prev);
    };
    
    // Fungsi bantuan untuk rendering tombol dengan gaya custom
    const renderCustomButton = (
        onClick: () => void,
        icon: React.ReactNode,
        text: string
    ) => (
        <button
            onClick={onClick}
            className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white transition duration-150 ease-in-out"
            style={{ backgroundColor: buttonColor }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = buttonHoverColor)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = buttonColor)}
        >
            {icon}
            {text}
        </button>
    );

    // Fungsi bantuan untuk rendering tautan (link) dengan gaya custom
    const renderCustomLink = (
        href: string,
        icon: React.ReactNode,
        text: string
    ) => (
        <a 
            href={href}
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white transition duration-150 ease-in-out"
            style={{ backgroundColor: buttonColor }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = buttonHoverColor)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = buttonColor)}
        >
            {icon}
            {text}
        </a>
    );


    return (
        <section className="py-16 md:py-20 bg-white">
            <div className="container mx-auto px-4 max-w-2xl">
                <div className="text-center">
                    
                    {/* --- HEADER --- */}
                    <div className="mb-4">
                        <img 
                            src="/assets/images/weddinggift.png" 
                            alt="Wedding Gift" 
                            className="mx-auto max-w-[200px] md:max-w-[280px]"
                        />
                    </div>
                    
                    {/* Deskripsi */}
                    <p className="text-base text-gray-600 leading-relaxed mt-8 mb-12" style={{fontFamily: "Markazi Text, serif"}}>
                        Doa restu anda merupakan karunia yang sangat berarti bagi kami, dan jika memberi adalah ungkapan tanda kasih anda, anda dapat memberi kado secara cashless.
                    </p>
                    
                    {/* --- Bagian KLIK WEDDING GIFT (Tombol Utama) --- */}
                    <div className="mb-10">
                        <p className="text-sm uppercase tracking-wider text-gray-700 font-medium mb-3" style={{fontFamily: "Markazi Text, serif"}}>
                            KLIK WEDDING GIFT
                        </p>
                        
                        {/* Tombol Wedding Gift */}
                        <button
                            onClick={handleGiftButtonClick}
                            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white transition duration-150 ease-in-out"
                            style={{ backgroundColor: buttonColor }} // Warna kustom
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = buttonHoverColor)} // Hover kustom
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = buttonColor)} // Kembali ke warna kustom
                        >
                            <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M5.4 3.3l-.9.9.9.9.9-.9-.9-.9zm9.2 0l-.9.9.9.9.9-.9-.9-.9zM10 2c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 14.5c-3.6 0-6.5-2.9-6.5-6.5 0-2.3 1.2-4.4 3-5.5.4-.2.9-.1 1.2.3l.6.8c.2.3.6.4.9.4.4 0 .7-.1.9-.4l.6-.8c.3-.4.8-.5 1.2-.3 1.8 1.1 3 3.2 3 5.5 0 3.6-2.9 6.5-6.5 6.5zM10 8a2 2 0 100 4 2 2 0 000-4z" />
                            </svg>
                            Wedding Gift
                        </button>
                    </div>

                    {/* --- Konten Cashless & Alamat (Tampil Bersyarat) --- */}
                    {isCashlessVisible && (
                        <div className="space-y-8 mt-12 mb-12"> 
                            
                            {/* Card Rekening */}
                            <div className="bg-white p-8 rounded-xl shadow-lg">
                                <h3 className="text-3xl font-['Playfair_Display',serif] italic font-light text-gray-800 mb-6" style={{fontFamily: "Markazi Text, serif"}}>Rekening</h3>
                                
                                <p className="text-lg font-medium text-gray-800" style={{fontFamily: "Markazi Text, serif"}}>{rekeningData.bank}</p>
                                <p className="text-2xl font-bold text-gray-900 mb-4" style={{fontFamily: "Markazi Text, serif"}}>{rekeningData.nomor}</p>
                                
                                {/* Tombol Salin Rekening */}
                                {renderCustomButton(
                                    () => copyToClipboard(rekeningData.nomor, 'Nomor Rekening'),
                                    <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
                                        <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2h2V5a2 2 0 012-2h6a2 2 0 00-2-2H5z" />
                                    </svg>,
                                    'Salin Rekening'
                                )}
                                
                                <p className="text-base text-gray-600 mt-4" style={{fontFamily: "Markazi Text, serif"}}>an. **{rekeningData.atasNama}**</p>
                                
                                {/* Gambar-gambar bank */}
                                <div className="flex justify-center space-x-4 mt-4">
                                    <img src="/assets/images/BCA.png" alt="BCA" className="h-12 object-contain"/>
                                    <img src="/assets/images/QRIS2.png" alt="QRIS" className="h-12 object-contain"/>
                                    <img src="/assets/images/Seabank.png" alt="Seabank" className="h-12 object-contain"/>
                                </div>
                            </div>

                            {/* Card Kirim Kado (Alamat) */}
                            <div className="bg-white p-8 rounded-xl shadow-lg">
                                <h3 className="text-3xl font-['Playfair_Display',serif] italic font-light text-gray-800 mb-6" style={{fontFamily: "Markazi Text, serif"}}>Kirim Kado</h3>
                                
                                <p className="text-lg font-medium text-gray-800" style={{fontFamily: "Markazi Text, serif"}}>Alamat</p>
                                <p className="text-2xl font-normal text-gray-900 mb-4" style={{fontFamily: "Markazi Text, serif"}}>{alamatData.judul}</p> 
                                
                                {/* Tombol Salin Alamat */}
                                {renderCustomButton(
                                    () => copyToClipboard(alamatData.detail, 'Alamat'),
                                    <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
                                        <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2h2V5a2 2 0 012-2h6a2 2 0 00-2-2H5z" />
                                    </svg>,
                                    'Salin Alamat'
                                )}
                            </div>

                        </div>
                    )}
                    
                    {/* --- Bagian KONFIRMASI WEDDING GIFT (Selalu Tampil) --- */}
                    <div className='mt-8'> 
                        <p className="text-sm uppercase tracking-wider text-gray-700 font-medium mb-3" style={{fontFamily: "Markazi Text, serif"}}>
                            KONFIRMASI WEDDING GIFT
                        </p>
                        {/* Tombol Konfirmasi Via WA */}
                        {renderCustomLink(
                            "https://wa.me/6289528048690", // Ganti dengan nomor WhatsApp Anda
                            <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 12.5a.5.5 0 011 0V10a.5.5 0 01-1 0v2.5zM12 12.5a.5.5 0 011 0V10a.5.5 0 01-1 0v2.5z" />
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7.3-3.7a.5.5 0 01.4-.2c.5.1 1.1.2 1.6.2.6 0 1.1-.1 1.6-.2a.5.5 0 01.4.2L16 8.5a.5.5 0 01-.1.7l-1.3 1.3a.5.5 0 01-.4.1.5.5 0 01-.4-.2l-.6-.8a.5.5 0 00-.7 0l-.6.8a.5.5 0 01-.4.2.5.5 0 01-.4-.1L7.5 9a.5.5 0 01-.1-.7l1.3-1.3a.5.5 0 01.4-.2.5.5 0 01.4.2c.5.1 1.1.2 1.6.2.6 0 1.1-.1 1.6-.2a.5.5 0 01.4.2L16 8.5a.5.5 0 01-.1.7l-1.3 1.3a.5.5 0 01-.4.1.5.5 0 01-.4-.2l-.6-.8a.5.5 0 00-.7 0l-.6.8a.5.5 0 01-.4.2.5.5 0 01-.4-.1L7.5 9a.5.5 0 01-.1-.7l1.3-1.3a.5.5 0 01.4-.2.5.5 0 01.4.2z" clipRule="evenodd" />
                            </svg>,
                            'Konfirmasi Via WA'
                        )}
                    </div>

                </div>
            </div>
        </section>
    );
};

export default GiftSection;