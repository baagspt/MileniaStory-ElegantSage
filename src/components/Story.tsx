import React, { useRef, useEffect, useState } from 'react';

// =================================================================
// 1. DEFINISI KOMPONEN TimelineItem
// =================================================================

interface TimelineItemProps {
    date: string;
    title: string;
    description: string;
    imageUrl: string;
    isLast: boolean; 
}

// Konstanta untuk posisi dan ukuran Pin (tidak berubah, digunakan untuk perhitungan)
const PIN_PULL_LEFT_DESKTOP = '-32px'; 
const PIN_PULL_LEFT_MOBILE = '-25px';
const PIN_HEIGHT_DESKTOP = 32; // Dalam piksel
const PIN_HEIGHT_MOBILE = 24; // Dalam piksel
const ITEM_MARGIN_BOTTOM = 40; // Dalam piksel (dari my-10)

const TimelineItem: React.FC<TimelineItemProps> = ({
    date,
    title,
    description,
    imageUrl,
    isLast 
}) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [cardHeight, setCardHeight] = useState(0);

    // Fungsi untuk menghitung tinggi konten secara dinamis
    useEffect(() => {
        const updateHeight = () => {
            if (cardRef.current) {
                // Ambil tinggi kartu dan tambahkan margin bawahnya
                setCardHeight(cardRef.current.offsetHeight + ITEM_MARGIN_BOTTOM);
            }
        };

        // Hitung awal
        updateHeight(); 
        
        // Tambahkan listener untuk mendengarkan perubahan ukuran
        window.addEventListener('resize', updateHeight);

        // Observer untuk mendeteksi perubahan DOM di dalam kartu (misalnya saat konten memuat)
        const observer = new MutationObserver(updateHeight);
        if (cardRef.current) {
             observer.observe(cardRef.current, { attributes: true, childList: true, subtree: true });
        }

        // Cleanup
        return () => {
            window.removeEventListener('resize', updateHeight);
            observer.disconnect();
        };
    }, []);

    // Tentukan apakah garis harus digambar (jangan gambar untuk item terakhir)
    const shouldDrawLine = !isLast; 

    // Tentukan tinggi garis untuk Desktop secara dinamis
    const desktopLineHeight = cardHeight > 0 ? `${cardHeight - PIN_HEIGHT_DESKTOP}px` : `300px`; // Fallback 300px
    const mobileLineHeight = cardHeight > 0 ? `${cardHeight - PIN_HEIGHT_MOBILE}px` : `300px`; // Fallback 300px

    // Posisi awal garis (top) untuk semua item: tepat di bawah pin.
    const desktopLineTop = PIN_HEIGHT_DESKTOP;
    const mobileLineTop = PIN_HEIGHT_MOBILE;
    
    return (
        // my-10 memberikan margin 40px di atas dan bawah setiap item
        <div className="flex w-full my-10 pl-4 md:pl-10"> 
            
            <div className={`w-full relative`}> 
                
                <div 
                    ref={cardRef} // Pasang ref di sini untuk mengukur tinggi
                    className="flex flex-col w-full max-w-[325px] 
                    md:max-w-[520px] 
                    rounded-xl shadow-2xl bg-white border border-gray mx-auto md:mx-0 md:ml-6" // mx-auto untuk pusatkan di mobile
                > 
                    
                    {/* Gambar Container */}
                    <div className="w-full p-[10px] pb-4"> 
                        <div className="relative pt-[56.25%]"> {/* Aspect Ratio 16:9 - 9/16 = 0.5625 (56.25%) */}
                            <img
                                src={imageUrl}
                                alt={title}
                                // Ubah height statis menjadi absolut di dalam container rasio aspek
                                className="absolute top-0 left-0 w-full h-full object-cover shadow-md rounded-xl" 
                                loading="lazy"
                            />
                        </div>
                    </div>

                    {/* Deskripsi Teks */}
                    <div className="w-full flex flex-col justify-center text-left px-[20px] pb-[20px] pt-0"> 
                        {/* ✅ PERUBAHAN 1: Date text color menjadi #414C3D */}
                        <p className="text-xs font-medium text-[#414C3D] mb-1 text-left" style={{fontFamily: "Markazi Text, serif"}}>{date}</p> 
                        
                        {/* ✅ PERUBAHAN 2: Title text color menjadi #414C3D */}
                        <h3 className="text-xl font-serif text-[#414C3D] mb-3 text-left" style={{fontFamily: "Markazi Text, serif"}}>{title}</h3> 
                        
                        {/* ✅ PERUBAHAN 3: Description text color menjadi #414C3D */}
                        <p className="text-[#414C3D] leading-relaxed text-left text-sm" style={{fontFamily: "Markazi Text, serif"}}> 
                            {description}
                        </p>
                    </div>
                </div>

                {/* Timeline Pin/Ikon (Desktop) */}
                <div 
                    className={`absolute top-0 hidden md:block`} 
                    style={{ left: PIN_PULL_LEFT_DESKTOP }} 
                > 
                    {/* ✅ PERUBAHAN 4: Ikon pin (lingkaran) diubah menjadi border-2 border-white */}
                    <div className="bg-white border-2 border-white rounded-full w-8 h-8 flex items-center justify-center relative z-10 shadow-md">
                        {/* ✅ PERUBAHAN 5: Warna ikon kalender menjadi #727E6A */}
                        <svg className="w-4 h-4 text-[#727E6A]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                    </div>

                    {/* GARIS VERTIKAL DESKTOP - Tinggi dinamis */}
                    {shouldDrawLine && (
                        <div 
                            // ✅ PERUBAHAN 6: Garis vertikal diubah menjadi putih (bg-white)
                            className="absolute w-0.5 bg-white z-0" 
                            style={{ 
                                top: desktopLineTop, 
                                height: desktopLineHeight, 
                                left: '15px' 
                            }} 
                        ></div>
                    )}
                </div>

                {/* Ikon untuk Mobile */}
                <div 
                    className={`absolute top-0 md:hidden z-10`} 
                    style={{left: PIN_PULL_LEFT_MOBILE}}
                >
                    {/* ✅ PERUBAHAN 7: Ikon pin (lingkaran) diubah menjadi border-2 border-white */}
                    <div className="bg-white border-2 border-white rounded-full w-6 h-6 flex items-center justify-center relative shadow-sm">
                        {/* ✅ PERUBAHAN 8: Warna ikon kalender menjadi #727E6A */}
                        <svg className="w-4 h-4 text-[#727E6A]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                    </div>
                    
                    {/* GARIS VERTIKAL MOBILE - Tinggi dinamis */}
                    {shouldDrawLine && (
                        <div 
                            // ✅ PERUBAHAN 9: Garis vertikal diubah menjadi putih (bg-white)
                            className="absolute w-0.5 bg-white z-0" 
                            style={{ 
                                top: mobileLineTop, 
                                height: mobileLineHeight, 
                                left: '11px' 
                            }} 
                        ></div>
                    )}
                </div>

            </div>
        </div>
    );
};


// -------------------------------------------------------------------------------- //
// --- Komponen Utama Story ---
// -------------------------------------------------------------------------------- //
const Story: React.FC = () => {
    const loveStoryEvents = [
        {
            date: '12 September 2017',
            title: 'Awal Bertemu',
            description: 'Tahun di mana dia dikenalkan oleh rekan kerjanya yang juga temanku melalui sosial media.',
            imageUrl: '/assets/images/sample2.jpg',
        },
        {
            date: '20 June 2018',
            title: 'Kencan Pertama',
            description: 'Sebuah janji pertemuan yang canggung namun berkesan, menjadi awal dari segalanya.',
            imageUrl: '/assets/images/sample2.jpg',
        },
        {
            date: '25 December 2020',
            title: 'Lamaran',
            description: 'Di penghujung tahun, sebuah pertanyaan besar diajukan, dan jawaban "Ya" membawa kami ke langkah selanjutnya.',
            imageUrl: '/assets/images/sample2.jpg',
        },
    ];

    return (
        <section className="py-20 bg-[#727E6A]">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <div className="mb-4">
                        <img 
                            src="/assets/images/lovestory.png" 
                            alt="Love Story" 
                            className="mx-auto max-w-[200px] md:max-w-[280px]"
                        />
                    </div>
                    
                    {/* ✅ PERUBAHAN 10: Teks 'The beautiful journey...' diubah menjadi putih (text-white) agar terlihat jelas di latar belakang #727E6A */}
                    <p className="text-xl text-white max-w-2xl mx-auto" style={{fontFamily: "Markazi Text, serif"}}>
                        The beautiful journey of our love
                    </p>
                    
                </div>

                <div className="relative max-w-6xl mx-auto">
                    
                    {loveStoryEvents.map((event, index) => (
                        <TimelineItem
                            key={index}
                            isLast={index === loveStoryEvents.length - 1} // Kirim prop isLast
                            date={event.date}
                            title={event.title}
                            description={event.description}
                            imageUrl={event.imageUrl}
                        />
                    ))}
                    
                </div>
            </div>
        </section>
    );
};

export default Story;