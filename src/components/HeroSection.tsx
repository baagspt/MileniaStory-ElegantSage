import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat overflow-hidden" 
             style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1950&q=80')" }}>
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-70"></div>
      <div className="relative z-10 text-center text-white px-4">
        <div className="mb-2">
          <span className="text-lg md:text-xl tracking-widest">SAVE THE DATE</span>
        </div>
        <div className="flex justify-center mb-4">
          <div className="w-12 h-0.5 bg-white mx-auto"></div>
        </div>
        <h1 className="text-4xl md:text-7xl font-light mb-2">Akira & Sakura</h1>
        <p className="text-lg md:text-xl font-light mb-6">Saturday, 5th May 2025</p>
        <div className="w-10 h-0.5 bg-amber-400 mx-auto mb-10"></div>
        <div className="text-sm md:text-base tracking-widest">
          <p>THEY ARE GETTING MARRIED</p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;