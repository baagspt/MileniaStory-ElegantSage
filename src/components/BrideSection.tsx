import React from 'react';

const BrideSection: React.FC = () => {
    return (
        // Gradien dari #414C3D/100 (atas) ke #727E6A (bawah).
        <section className="pt-0 pb-0 bg-gradient-to-b from-[#414C3D]/100 to-[#727E6A]"> 
            
            <div className="container mx-auto px-4 pt-20"> 
            
                {/* Card Putih Utama */}
                <div 
                    className="rounded-t-3xl shadow-2xl overflow-hidden w-full mx-auto max-w-2xl"
                    style={{ backgroundColor: '#FFFFFF' }} 
                >
                    
                    {/* The Groom section - Konten di dalam card */}
                    <div className="text-center px-4 pt-12 pb-12">
                    
                        {/* ======================================= */}
                        {/* START: Penambahan Teks OUR WEDDING dan Undangan */}
                        {/* ======================================= */}
                        
                        {/* MODIFIKASI: text-3xl untuk mobile, md:text-4xl untuk desktop */}
                        <p className="text-3xl md:text-4xl font-semibold tracking-widest text-[#414C3D] mb-2" style={{fontFamily: "Markazi Text, serif"}}>
                            OUR WEDDING
                        </p>
                        
                        {/* ✅ PERUBAHAN 1: Teks undangan diubah menjadi text-[#414C3D] */}
                        <p className="text-[#414C3D] text-sm italic mb-10 mx-auto max-w-md" style={{fontFamily: "Markazi Text, serif"}}>
                            Tanpa mengurangi rasa hormat, kami bermaksud mengundang Bapak/Ibu/Saudara/I untuk menghadiri acara Pernikahan kami.
                        </p>
                        
                        {/* ======================================= */}
                        {/* END: Penambahan Teks OUR WEDDING dan Undangan */}
                        {/* ======================================= */}

                        {/* Divider di atas judul */}
                        <div className="flex justify-center mt-4 mb-6">
                            <div className="w-10 h-0.5 bg-[#414C3D]"></div>
                        </div>
                        
                        {/* Judul The Bride */}
                        <h2 className="text-3xl md:text-4xl font-medium text-[#414C3D] mt-6 mb-6" style={{fontFamily: "Markazi Text, serif"}}>The Bride</h2> 
                        
                    </div>
                    
                    {/* Foto dan Nama */}
                    <div className="flex flex-col items-center px-4">
                    
                        {/* BINGKAI FOTO MELENGKUNG */}
                        <div 
                            className="relative overflow-hidden mx-auto mb-6"
                            style={{
                                width: 'min(90%, 28rem)', 
                                aspectRatio: '7 / 10', 
                                border: '4px solid #414C3D', 
                                backgroundColor: '#f0f0f0', 
                                borderRadius: '20rem 20rem 0 0', 
                            }}
                        >
                            <img 
                                src="/assets/images/bride.png" 
                                alt="Groom" 
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        </div>
                        {/* Akhir Bingkai Foto Melengkung */}
                        
                        <h3 className="text-2xl md:text-3xl font-medium text-[#414C3D] mb-2" style={{fontFamily: "Markazi Text, serif"}}>Pacar </h3>
                        
                        <p className="text-[#414C3D] mb-4" style={{fontFamily: "Markazi Text, serif"}}>Putri Pertama Dari Keluarga</p>
                        
                        <p className="text-[#414C3D] mb-0 pb-12" style={{fontFamily: "Markazi Text, serif"}}>Bapak Milenia & Ibu Story</p> 
                        
                    </div>
                </div>
                
            </div>
        </section>
    );
};

export default BrideSection;