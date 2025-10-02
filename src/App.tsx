import { useState, useRef } from "react"; 
// All components are assumed to be defined/imported correctly in the local context
import AudioPlayer from "./components/AudioPlayer";
import CoverScreen from "./components/CoverScreen";
import CoupleSection from "./components/CoupleSection";
import BrideSection from "./components/BrideSection";
import GroomSection from "./components/GroomSection";
import EventSection from "./components/EventSection";
import GallerySection from "./components/GallerySection";
import Story from "./components/Story";
import GiftSection from "./components/GiftSection";
import Live from "./components/Live";
import QRSection from "./components/QRSection";
import RSVPSection from "./components/RSVPSection";
import Footer from "./components/Footer";

// Ambil nama tamu dari URL
const getUrlParameter = (name: string) => {
  const urlParams = new URLSearchParams(window.location.search);
  const value = urlParams.get(name) || "Tamu Undangan";
  if (value && value !== "Tamu Undangan") {
    // Memastikan setiap kata dimulai dengan huruf kapital
    return value
      .split(" ")
      .map(
        word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join(" ");
  }
  return value;
};

function App() {
  const guestName = getUrlParameter("to");
  const [showContent, setShowContent] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  
  // Ref untuk Div 30% (Konten Utama) - Target Scroll
  const contentRef = useRef<HTMLDivElement>(null); 

  const handleOpenInvitation = () => {
    setShowContent(true);
    setAudioPlaying(true);
  };

  const toggleAudio = () => {
    setAudioPlaying(!audioPlaying);
  };
  
  // Fungsi untuk Mengarahkan Scroll dari 70% ke 30%
  const handleWheelOnCover = (e: React.WheelEvent<HTMLDivElement>) => {
    if (contentRef.current) {
      // Mencegah scroll default pada elemen 70%
      e.preventDefault(); 
      
      // Mengarahkan scroll vertikal ke div 30%
      contentRef.current.scrollTop += e.deltaY;
    }
  };

  // Define the Main Content section as a reusable component/variable 
  const MainContentSections = (
    <>
      <CoupleSection />
      <BrideSection />
      <GroomSection />
      <EventSection />
      <GallerySection />
      <Story />
      <GiftSection />
      <Live />
      <QRSection />
      <RSVPSection />
      <Footer />
    </>
  );

  return (
    // Kontainer utama yang mengunci viewport
    <div className="w-full h-screen font-serif overflow-hidden">
      
      {/* Audio Player */}
      {showContent && (
        <AudioPlayer 
          src="/audio/bg.mp3" 
          isPlaying={audioPlaying} 
          onPlayPause={toggleAudio} 
        />
      )}
      
      {/* ==================== MOBILE / TABLET LAYOUT (Full Width) ==================== */}
      <div className="block xl:hidden w-full h-full">
        {!showContent ? (
          <CoverScreen
            guestName={guestName}
            onOpenInvitation={handleOpenInvitation}
            audioPlaying={audioPlaying}
            showButton={true} 
          />
        ) : (
          // Scroll konten mobile
          <div className="w-full h-full overflow-y-auto bg-white shadow-lg">
            {MainContentSections}
          </div>
        )}
      </div>

      {/* ==================== DESKTOP LAYOUT (Split View) ==================== */}
      <div className="hidden xl:flex w-full h-full"> 
        {showContent ? (
          // Split View 70:30
          <>
            {/* Bagian 70% (CoverScreen) - Terkunci & Trigger Scroll */}
            <div 
              className="w-[68%] h-full" 
              onWheel={handleWheelOnCover} // Event Listener untuk memicu scroll 30%
            > 
              <CoverScreen
                guestName={guestName}
                onOpenInvitation={handleOpenInvitation}
                audioPlaying={audioPlaying}
                showButton={false} 
              />
            </div>

            {/* Bagian 30% (Konten Utama) - Target Scroll. Tambahkan Ref. */}
            <div 
              className="w-[32%] h-full overflow-y-auto bg-white shadow-lg"
              ref={contentRef} // Target Ref untuk scroll
            >
              {MainContentSections}
            </div>
          </>
        ) : (
          // Cover 100% saat belum dibuka
          <div className="w-full h-full">
            <CoverScreen
              guestName={guestName}
              onOpenInvitation={handleOpenInvitation}
              audioPlaying={audioPlaying}
              showButton={true} 
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;