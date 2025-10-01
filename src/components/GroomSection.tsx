import React from 'react';

const GroomSection: React.FC = () => {
 return (
  <section className="pt-0 pb-20" style={{ backgroundColor: '#546e7a' }}>
   
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
      
      {/* MODIFIKASI: Menghilangkan teks undangan. */}
      {/* Paragraf Undangan yang berisi "Tanpa mengurangi rasa hormat..." sudah dihapus. */}
      
      {/* ======================================= */}
      {/* END: Area Teks Undangan */}
      {/* ======================================= */}

      {/* Divider di atas judul */}
      <div className="flex justify-center mt-4 mb-6">
       {/* MODIFIKASI: bg-gray-900 untuk warna hitam */}
       {/* Catatan: Karena teks undangan di atasnya dihapus, mungkin Anda perlu menyesuaikan kelas `mt-4` pada div ini */}
       <div className="w-10 h-0.5 bg-gray-900"></div>
      </div>
      
      {/* Judul The Groom */}
      <h2 className="text-3xl md:text-4xl font-medium text-gray-800 mt-6 mb-6" style={{fontFamily: "Markazi Text, serif"}}>The Groom</h2> 
      
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
        
        // MENGHILANGKAN paddingBottom dan height: 0 yang tidak diperlukan
        
        border: '4px solid #D2D6E3', 
        backgroundColor: '#f0f0f0', 
        
        // KUNCI PERUBAHAN: Menggunakan radius besar di kiri-atas dan kanan-atas
        // untuk menciptakan satu lengkungan halus di bagian atas.
        borderRadius: '20rem 20rem 0 0', 
       }}
      >
       <img 
        src="/assets/images/groom.png" 
        alt="Groom" 
        className="absolute inset-0 w-full h-full object-cover"
       />
      </div>
      {/* Akhir Bingkai Foto Melengkung */}
      
      <h3 className="text-2xl md:text-3xl font-medium text-gray-800 mb-2" style={{fontFamily: "Markazi Text, serif"}}>Rian</h3>
      <p className="text-gray-600 mb-4" style={{fontFamily: "Markazi Text, serif"}}>Putra Kedua Dari Keluarga</p>
      <p className="text-gray-600 mb-0 pb-12" style={{fontFamily: "Markazi Text, serif"}}>Bapak Milenia & Ibu Story</p>
     </div>
    </div>
    
   </div>
  </section>
 );
};

export default GroomSection;