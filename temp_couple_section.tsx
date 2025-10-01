import React, { useState, useEffect } from 'react';

// =================================================================
// 1. DEFINISI KOMPONEN COUNTDOWN TIMER (DIPERLUKAN DI CoupleSection)
// =================================================================

interface TimeLeft {
 days: number;
 hours: number;
 minutes: number;
 seconds: number;
}

const calculateTimeLeft = (): TimeLeft => {
 // Tanggal target: 2025-10-05
 const difference = +new Date('2025-10-05') - +new Date(); 
 
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

// Pastikan TimeUnit dideklarasikan sebelum CountdownTimer menggunakannya
const TimeUnit: React.FC<{ value: number; label: string }> = ({ value, label }) => {
 const paddedValue = value.toString().padStart(2, '0');

 return (
  // Memberikan sedikit margin horizontal (mx-2) agar ada sedikit jarak antar unit
  <div className="flex flex-col items-center mx-2"> 
   {/* Mengurangi ukuran angka menjadi text-lg (18px) dan sm:text-xl (20px) */}
   <span className="text-lg sm:text-xl font-medium text-white leading-none font-sans">
    {paddedValue}
   </span>
   {/* Mengurangi ukuran label menjadi text-xs (12px) */}
   <span className="mt-1 text-xs font-normal text-white font-sans"> 
    {label}
   </span>
  </div>
 );
};

// Pastikan CountdownTimer dideklarasikan sebelum CoupleSection menggunakannya
const CountdownTimer: React.FC = () => {
 // Menghilangkan warning 'useState' is declared but its value is never read.
 const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft()); 

 // Menghilangkan warning 'useEffect' is declared but its value is never read.
 useEffect(() => {
  const timer = setInterval(() => {
   setTimeLeft(calculateTimeLeft());
  }, 1000);

  return () => clearInterval(timer);
 }, []);

 return (
  <div className="flex justify-center mb-8 sm:mb-12 md:mb-16"> 
    {/* Mengganti gap-2 sm:gap-3 dengan gap-4 untuk memberikan lebih banyak renggang */}
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
 // PERBAIKAN: Menambahkan tipe eksplisit 'string[]' untuk menghilangkan error 7034 & 7005
 const images: string[] = [
  "https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1472396961693-142e6e269027?q=80&w=2152&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1505142468610-359e7d316be0?q=80&w=2126&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8cGhvdG8tZ3JpZCUzZHJlc3BvbnNpdmVfaW1hZ2VzJTI2Y29sdW1ucyUzZDMtNCUyNiUzZmF1dG9fYWRqdXN0JTNkMHx8fGVu"
,
  "https://images.unsplash.com/photo-1482881497185-d4a9ddbe4151?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1673264933212-d78737f38e48?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1711434824963-ca894373272e?q=80&w=2030&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1675705721263-0bbeec261c49?q=80&w=1940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1524799526615-766a9833dec0?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
 ];

 const duplicatedImages = [...images, ...images];

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
   <div className="absolute inset-0 bg-gradient-to-b from-[#607d8b]/70 to-[#263238]/90" />
   
   {/* Konten Teks & Tanggal (Atas) */}
   <div className="relative z-10 py-12 sm:py-16 md:py-20">
    <div className="text-center text-white w-full max-w-4xl mx-auto px-4"> 
     <div className="mb-6 sm:mb-8">
       {/* PERUBAHAN UTAMA DI SINI: Mengubah text-[10px] menjadi text-[8px] */}
      <p className="text-[8px] sm:text-xs md:text-sm tracking-widest font-montserrat font-bold"> 
       The Wedding Of
      </p>
     </div>

     <h1 className="text-4xl sm:text-5xl md:text-6xl font-normal font-whisper tracking-tight mb-6 sm:mb-8">
      Yudhistira &amp; Pacar
     </h1>

     <p className="text-xs sm:text-sm md:text-base font-light font-Alan-Sans mb-16 sm:mb-24 md:mb-32">01.10.2025</p> 
    </div>
   </div>
   
   {/* Lokasi Countdown Timer & Ayat Quran */}
   <div className="relative z-10 px-4 mb-6 sm:mb-8"> 
    <div className="w-full max-w-3xl mx-auto text-center"> 
     
     <CountdownTimer /> 
     
     <blockquote className="text-white text-xs sm:text-sm italic font-serif mb-2 px-4" style={{fontFamily: "Markazi Text, serif"}}>
      "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antarmu rasa kasih dan sayang."
     </blockquote>
     <cite className="text-white text-xs sm:text-sm not-italic font-medium" style={{fontFamily: "Markazi Text, serif"}}>
      Q.S. Ar-Rum : 21
     </cite>
    </div>
   </div>
   
   {/* Scrolling images container */}
   <div className="relative z-10 py-4 pb-12 sm:pb-16 md:pb-20 overflow-hidden">
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
        className="image-item flex-shrink-0 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-lg overflow-hidden shadow-lg inline-block mr-2"
       >
        <img
         src={image}
         alt={`Gallery image ${(index % images.length) + 1}`}
         className="w-full h-full object-cover"
         loading="lazy"
         // Adding accessibility attributes
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