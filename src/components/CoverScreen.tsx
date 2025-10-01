"use client"; // Diperlukan karena menggunakan hooks seperti useState dan useTheme

import React, { useState, useEffect } from 'react';
import { StarButton } from "@/components/star-button"; 
import { useTheme } from "next-themes";

interface CoverScreenProps {
  guestName: string;
  onOpenInvitation: () => void;
  audioPlaying: boolean;
  showButton: boolean;
}

const CoverScreen: React.FC<CoverScreenProps> = ({
  guestName,
  onOpenInvitation,
  audioPlaying,
  showButton,
}) => {
  const { theme } = useTheme();

  // State untuk menyimpan warna efek StarButton
  const [lightColor, setLightColor] = useState("#FAFAFA"); 

  // Efek untuk memperbarui lightColor berdasarkan tema
  useEffect(() => {
    // Jika tema "dark", gunakan #FAFAFA (putih terang).
    // Jika tema "light", gunakan #FF2056 (merah menyala).
    setLightColor(theme === "dark" ? "#FAFAFA" : "#FF2056");
  }, [theme]); 

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/assets/images/bg.jpg')",
          filter: 'blur(1px)',
        }}
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-70"></div>

      {/* Konten - DITAMBAH py-12 UNTUK PADDING ATAS DAN BAWAH */}
      <div className="relative z-10 text-center text-white px-4 py-12"> 
        <div className="mb-8">
          <p className="text-sm md:text-base tracking-widest font-montserrat font-bold">
            The Wedding Of
          </p>
        </div>

        <h1 className="text-4xl md:text-6xl font-normal font-whisper tracking-tight mb-12">
          Yudhistira &amp; Pacar
        </h1>

        <p className="text-sm font-light font-Alan-Sans mb-40">02.02.2026</p>

        <div className="mb-8">
          <p className="text-sm md:text-base font-montserrat" style={{fontFamily: "Markazi Text, serif"}}>
            Kepada Yth. {guestName || 'Tamu Undangan'}
          </p>
        </div>

        {/* Menggunakan StarButton dengan efek animasi */}
        {showButton && (
          <StarButton 
            onClick={onOpenInvitation}
            lightColor={lightColor} 
            className="rounded-3xl bg-black text-white text-lg px-8 py-3 hover:bg-gray-800 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 active:scale-95"
          >
            <span style={{fontFamily: "Markazi Text, serif"}}>Buka Undangan</span>
          </StarButton>
        )}

        {audioPlaying && (
          <div className="mt-4 text-sm">
            <div className="flex items-center justify-center">
              <div className="h-2 w-2 bg-amber-400 rounded-full mr-1 animate-pulse"></div>
              <div className="h-2 w-2 bg-amber-400 rounded-full mr-1 animate-pulse delay-75"></div>
              <div className="h-2 w-2 bg-amber-400 rounded-full mr-1 animate-pulse delay-150"></div>
              <div className="h-2 w-2 bg-amber-400 rounded-full animate-pulse delay-300"></div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CoverScreen;