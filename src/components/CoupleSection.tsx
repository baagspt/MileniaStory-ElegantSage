import React, { useState, useEffect } from 'react';

// =================================================================
// 1. DEFINISI KOMPONEN COUNTDOWN TIMER
// =================================================================

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

const calculateTimeLeft = (): TimeLeft => {
    // Tanggal target: 2026-02-02
    // PERBAIKAN: Mengubah format tanggal dari 'YYYY-M-DD' menjadi 'YYYY/MM/DD' untuk kompatibilitas mobile yang lebih baik.
    const targetDate = '2026/02/02'; 
    const difference = +new Date(targetDate) - +new Date(); 
    
    if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
    };
};

const TimeUnit: React.FC<{ value: number; label: string }> = ({ value, label }) => {
    const paddedValue = value.toString().padStart(2, '0');

    return (
        <div className="flex flex-col items-center mx-2"> 
            {/* Angka */}
            <span className="text-xl sm:text-2xl font-medium text-white leading-none font-sans" style={{fontFamily: "Markazi Text, serif"}}>
                {paddedValue}
            </span>
            {/* Label */}
            <span className="mt-1 text-sm sm:text-base font-normal text-white font-sans" style={{fontFamily: "Markazi Text, serif"}}> 
                {label}
            </span>
        </div>
    );
};

const CountdownTimer: React.FC = () => {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft()); 

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex justify-center mb-8 sm:mb-12 md:mb-16"> 
            <div className="flex justify-center items-end gap-4"> 
                <TimeUnit value={timeLeft.days} label="Hari" />
                <TimeUnit value={timeLeft.hours} label="Jam" />
                <TimeUnit value={timeLeft.minutes} label="Menit" />
                <TimeUnit value={timeLeft.seconds} label="Detik" />
            </div>
        </div>
    );
};

// =================================================================
// 2. KOMPONEN UTAMA: CoupleSection
// =================================================================

const CoupleSection: React.FC = () => {
    const images: string[] = [
        "/assets/images/sample3.jpg",
        "/assets/images/sample3.jpg",
        "/assets/images/sample3.jpg",
        "/assets/images/sample3.jpg"
    ];

    const duplicatedImages = [...images, ...images, ...images, ...images];

    return (
        <section className="relative overflow-hidden w-full"> 
            {/* Background Image dan Overlay */}
            <div 
                className="absolute inset-0"
                style={{
                    backgroundImage: "url('/assets/images/bg1.jpg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#607d8b]/70 to-[#263238]/95" />
            
            {/* Konten Teks & Tanggal (Atas) */}
            <div className="relative z-10 pt-32 pb-20 sm:pt-24 sm:pb-24 md:pt-32 md:pb-32"> 
                <div className="text-center text-white w-full max-w-4xl mx-auto px-4"> 
                    <div className="mb-6 sm:mb-8">
                        {/* SUDAH DIPERBARUI: text-xs di mobile, md:text-base di desktop */}
                        <p className="text-xs sm:text-xs md:text-base tracking-widest font-montserrat font-bold" style={{fontFamily: "Markazi Text, serif"}}> 
                            The Wedding Of
                        </p>
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-normal font-whisper tracking-tight mb-6 sm:mb-8">
                        Alya &amp; Rian
                    </h1>

                    {/* Tanggal */}
                    <p className="text-base sm:text-lg md:text-xl font-light font-Alan-Sans mb-16 sm:mb-24 md:mb-32" style={{fontFamily: "Markazi Text, serif"}}>02.02.2026</p> 
                </div>
            </div>
            
            {/* Lokasi Countdown Timer & Ayat Quran */}
            <div className="relative z-10 px-4 mb-6 sm:mb-8"> 
                <div className="w-full max-w-3xl mx-auto text-center"> 
                
                    <CountdownTimer /> 
                
                    {/* Ayat Quran */}
                    <blockquote className="text-white text-sm sm:text-base italic font-serif mb-2 px-4" style={{fontFamily: "Markazi Text, serif"}}>
                        "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antarmu rasa kasih dan sayang."
                    </blockquote>
                    {/* Sumber Ayat */}
                    <cite className="text-white text-sm sm:text-base not-italic font-medium" style={{fontFamily: "Markazi Text, serif"}}>
                        Q.S. Ar-Rum : 21
                    </cite>
                </div>
            </div>
            
            {/* Scrolling images container */}
            <div className="relative z-10 py-4 pb-20 sm:pb-24 md:pb-32 overflow-hidden">
                <style>{`
                    @keyframes scroll-right {
                        0% {
                            transform: translateX(0);
                        }
                        100% {
                            transform: translateX(-50%);
                        }
                    }

                    .infinite-scroll {
                        display: inline-block;
                        animation: scroll-right 40s linear infinite;
                        white-space: nowrap;
                    }

                    .scroll-container {
                        overflow: hidden;
                        mask: linear-gradient(
                            90deg,
                            transparent 0%,
                            black 10%,
                            black 90%,
                            transparent 100%
                        );
                        -webkit-mask: linear-gradient(
                            90deg,
                            transparent 0%,
                            black 10%,
                            black 90%,
                            transparent 100%
                        );
                    }

                    .image-item {
                        transition: transform 0.3s ease, filter 0.3s ease;
                        display: inline-block;
                    }

                    .image-item:hover {
                        transform: scale(1.05);
                        filter: brightness(1.1);
                    }
                `}</style>
                
                <div className="scroll-container w-full max-w-6xl mx-auto"> 
                    <div className="infinite-scroll">
                    {duplicatedImages.map((image, index) => (
                        <div
                            key={index}
                            // PERUBAHAN DI SINI: w-28 h-28 untuk mobile (default)
                            className="image-item flex-shrink-0 w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-lg overflow-hidden shadow-lg inline-block mr-2"
                        >
                            <img
                                src={image}
                                alt={`Gallery image ${(index % images.length) + 1}`}
                                className="w-full h-full object-cover"
                                loading="lazy"
                                aria-label={`Gallery image ${index + 1}`}
                            />
                        </div>
                    ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CoupleSection;