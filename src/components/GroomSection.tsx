import React from 'react';

const GroomSection: React.FC = () => {
    return (
        <section className="pt-0 pb-20" style={{ backgroundColor: '#727E6A' }}>
            
            <div className="container mx-auto px-4">
            
                {/* Card Putih Utama */}
                <div 
                    className="rounded-b-3xl shadow-2xl overflow-hidden w-full mx-auto max-w-2xl"
                    style={{ backgroundColor: '#FFFFFF' }} 
                >
                    
                    {/* The Groom section - Konten di dalam card */}
                    <div className="text-center px-4 pt-12 pb-12">
                    
                        {/* ======================================= */}
                        {/* START: Area Teks Undangan (Sekarang Kosong) */}
                        {/* ======================================= */}
                        
                        {/* Paragraf Undangan yang berisi "Tanpa mengurangi rasa hormat..." sudah dihapus. */}
                        
                        {/* ======================================= */}
                        {/* END: Area Teks Undangan */}
                        {/* ======================================= */}

                        {/* Divider di atas judul */}
                        <div className="flex justify-center mt-4 mb-6">
                            {/* ✅ PERUBAHAN 1: Divider diubah menjadi bg-[#414C3D] */}
                            <div className="w-10 h-0.5 bg-[#414C3D]"></div>
                        </div>
                        
                        {/* Judul The Groom */}
                        {/* ✅ PERUBAHAN 2: Judul 'The Groom' diubah menjadi text-[#414C3D] */}
                        <h2 className="text-3xl md:text-4xl font-medium text-[#414C3D] mt-6 mb-6" style={{fontFamily: "Markazi Text, serif"}}>The Groom</h2> 
                        
                    </div>
                    
                    {/* Foto dan Nama */}
                    <div className="flex flex-col items-center px-4">
                    
                        {/* BINGKAI FOTO MELENGKUNG (SEPERTI BRIDE SECTION) */}
                        <div 
                            className="relative overflow-hidden mx-auto mb-6"
                            style={{
                                // Menjaga lebar keseluruhan (sama dengan Bride Section)
                                width: 'min(90%, 28rem)', 
                                
                                // MENGGUNAKAN ASPECT RATIO untuk mengatur dimensi
                                aspectRatio: '7 / 10', // Rasio panjang yang disepakati (mis. 3.5 / 5)
                                
                                // Warna border sudah benar #414C3D
                                border: '4px solid #414C3D', 
                                backgroundColor: '#f0f0f0', 
                                
                                // KUNCI PERUBAHAN: Menggunakan radius besar di kiri-atas dan kanan-atas
                                borderRadius: '20rem 20rem 0 0', 
                            }}
                        >
                            <img 
                                src="/assets/images/groom.jpg" 
                                alt="Groom" 
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        </div>
                        {/* Akhir Bingkai Foto Melengkung */}
                        
                        {/* ✅ PERUBAHAN 3: Nama 'Yudhistira' diubah menjadi text-[#414C3D] */}
                        <h3 className="text-2xl md:text-3xl font-medium text-[#414C3D] mb-2" style={{fontFamily: "Markazi Text, serif"}}>Yudhistira</h3>
                        
                        {/* ✅ PERUBAHAN 4: Teks 'Putra Kedua Dari Keluarga' diubah menjadi text-[#414C3D] */}
                        <p className="text-[#414C3D] mb-4" style={{fontFamily: "Markazi Text, serif"}}>Putra Kedua Dari Keluarga</p>
                        
                        {/* ✅ PERUBAHAN 5: Teks 'Bapak Milenia & Ibu Story' diubah menjadi text-[#414C3D] */}
                        <p className="text-[#414C3D] mb-0 pb-12" style={{fontFamily: "Markazi Text, serif"}}>Bapak Milenia & Ibu Story</p>
                    </div>
                </div>
                
            </div>
        </section>
    );
};

export default GroomSection;