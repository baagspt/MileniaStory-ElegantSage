export default function Example() {

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
                
                * {
                    font-family: 'Poppins', sans-serif;
                }
            `}</style>
            
            {/* Ganti text-gray-800/70 menjadi text-white/80 */}
            <footer className="flex flex-col items-center justify-around w-full pt-3 pb-6 text-sm bg-[#414C3D] text-white/80">
                <img 
                    src="/assets/images/logo3.png" 
                    alt="Wedding Logo" 
                    className="mx-auto mt-3 mb-1 w-32 h-auto" // PERUBAHAN: w-20 diubah menjadi w-32
                    // Fallback jika gambar tidak ditemukan
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "https://placehold.co/128x128/cccccc/333333?text=LOGO"; // Perbarui ukuran placeholder
                    }}
                />
                
                <p className="mt-4 text-center">
                    Copyright © 2025 . 
                    {/* Ubah warna tautan dalam paragraf menjadi putih penuh */}
                    <a 
                        href="https://mileniastory.vercel.app/" 
                        className="text-white hover:text-gray-300"
                        target="_blank" // ⬅️ DITAMBAHKAN: Membuka di tab baru
                        rel="noopener noreferrer" // ⬅️ DITAMBAHKAN: Keamanan
                    >
                        Milenia Story
                    </a>. 
                    All rights reservered.
                </p>
            </footer>
        </>
    );
}