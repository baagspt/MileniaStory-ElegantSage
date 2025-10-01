import React from 'react';

// --- Komponen TimelineItem (Satu Titik di Garis Waktu) ---
interface TimelineItemProps {
    date: string;
    title: string;
    description: string;
    imageUrl: string;
    index: number; 
}

// POSISI PIN (ikon) relatif terhadap kontainer KARTU (desktop) - TIDAK BERUBAH
const PIN_PULL_LEFT_DESKTOP = '-32px'; 
const PIN_PULL_LEFT_MOBILE = '-16px';

// Tinggi pin
const PIN_HEIGHT_DESKTOP = '32px'; 
const PIN_HEIGHT_MOBILE = '24px';

// Margin-bottom dari div TimelineItem = 40px (my-10)
const ITEM_MARGIN_BOTTOM = '40px'; 

// PENTING: Panjang Garis Ekstra di bawah item yang ingin dipanjangkan
const EXTRA_LINE_HEIGHT = '445px'; 


const TimelineItem: React.FC<TimelineItemProps> = ({
    date,
    title,
    description,
    imageUrl,
    index 
}) => {
    
    // Tentukan apakah garis harus digambar (hanya untuk index 0 dan 1)
    const shouldDrawLine = index < 2; 

    // PENTING: Tentukan apakah garis harus panjang statis (untuk index 0 dan 1)
    const shouldExtendLong = index === 0 || index === 1;

    // Tentukan tinggi garis untuk Desktop
    let desktopLineHeight;
    if (shouldExtendLong) { 
        desktopLineHeight = EXTRA_LINE_HEIGHT; 
    } else { 
        desktopLineHeight = `calc(100% + ${ITEM_MARGIN_BOTTOM} - ${PIN_HEIGHT_DESKTOP})`; 
    }

    // Tentukan tinggi garis untuk Mobile
    let mobileLineHeight;
    if (shouldExtendLong) { 
        mobileLineHeight = EXTRA_LINE_HEIGHT; 
    } else { 
        mobileLineHeight = `calc(100% + ${ITEM_MARGIN_BOTTOM} - ${PIN_HEIGHT_MOBILE})`; 
    }

    // Posisi awal garis (top) untuk semua item: tepat di bawah pin.
    const desktopLineTop = PIN_HEIGHT_DESKTOP;
    const mobileLineTop = PIN_HEIGHT_MOBILE;
    
    return (
        // my-10 memberikan margin 40px di atas dan bawah setiap item
        <div className="flex w-full my-10 pl-4 md:pl-10"> 
            
            <div className={`w-full relative`}> 
                
                <div className="flex flex-col w-full max-w-[325px] max-h-[500px] overflow-y-auto 
    md:max-w-[520px] md:max-h-none md:overflow-visible 
    rounded-xl shadow-2xl bg-white border border-gray mx-4 md:mx-0 md:ml-6">     
    
                    {/* Gambar */}
                    <div className="w-full p-[10px] pb-4"> 
                        <img
                            src={imageUrl}
                            alt={title}
                            className="w-full max-w-[500px] h-[281px] object-cover shadow-md rounded-xl" 
                        />
                    </div>

                    {/* Deskripsi Teks */}
                    <div className="w-full flex flex-col justify-center text-left px-[20px] pb-[16px] pt-0"> 
                        <p className="text-xs font-medium text-gray-500 mb-1 text-left" style={{fontFamily: "Markazi Text, serif"}}>{date}</p> 
                        
                        <h3 className="text-xl font-serif text-gray-900 mb-3 text-left" style={{fontFamily: "Markazi Text, serif"}}>{title}</h3> 
                        
                        <p className="text-gray-700 leading-relaxed text-left text-sm" style={{fontFamily: "Markazi Text, serif"}}> 
                            {description}
                        </p>
                    </div>
                </div>

                {/* Timeline Pin/Ikon (Desktop) */}
                <div 
                    className={`absolute top-0 hidden md:block`} 
                    style={{ left: PIN_PULL_LEFT_DESKTOP }} 
                > 
                    {/* Ganti border-[#37474f] menjadi border-white. Warna icon tetap text-[#37474f] */}
                    <div className="bg-white border-2 border-white rounded-full w-8 h-8 flex items-center justify-center relative z-10 shadow-md">
                        <svg className="w-4 h-4 text-[#37474f]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                    </div>

                    {/* GARIS VERTIKAL DESKTOP */}
                    {shouldDrawLine && (
                        <div 
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
                    {/* Ganti border-[#37474f] menjadi border-white. Warna icon tetap text-[#37474f] */}
                    <div className="bg-white border-2 border-white rounded-full w-6 h-6 flex items-center justify-center relative shadow-sm">
                        <svg className="w-4 h-4 text-[#37474f]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                    </div>
                    
                    {/* GARIS VERTIKAL MOBILE */}
                    {shouldDrawLine && (
                        <div 
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
// --- Komponen Utama Story (Tidak ada perubahan) ---
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
        <section className="py-20 bg-[#546e7a]">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <div className="mb-4">
                        <img 
                            src="/assets/images/lovestory.png" 
                            alt="Love Story" 
                            className="mx-auto max-w-[200px] md:max-w-[280px]"
                        />
                    </div>
                    
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto" style={{fontFamily: "Markazi Text, serif"}}>
                        The beautiful journey of our love
                    </p>
                    
                </div>

                <div className="relative max-w-6xl mx-auto">
                    
                    {loveStoryEvents.map((event, index) => (
                        <TimelineItem
                            key={index}
                            index={index} 
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
