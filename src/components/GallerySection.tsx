import React, { useState } from 'react';

// --- Komponen GallerySection (Menggantikan Story Component) ---
const GallerySection: React.FC = () => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    
    // Original images defined by ID.
    const originalImages = [
        { id: 1, src: '/assets/images/sample1.jpg', alt: 'Aesthetic Nature Image 1', isPortrait: true }, 
        { id: 2, src: '/assets/images/sample1.jpg', alt: 'Aesthetic Nature Image 2', isPortrait: true }, 
        { id: 3, src: '/assets/images/sample1.jpg', alt: 'Aesthetic Nature Image 3', isPortrait: true }, 
        { id: 8, src: '/assets/images/sample1.jpg', alt: 'Aesthetic Nature Image 8', isPortrait: true }, 
        // Landscape Images (akan ditumpuk)
        { id: 4, src: '/assets/images/sample2.jpg', alt: 'Aesthetic Nature Image 4', isPortrait: false }, 
        { id: 5, src: '/assets/images/sample2.jpg', alt: 'Aesthetic Nature Image 5', isPortrait: false }, 
        { id: 6, src: '/assets/images/sample2.jpg', alt: 'Aesthetic Nature Image 6', isPortrait: false }, 
        { id: 7, src: '/assets/images/sample2.jpg', alt: 'Aesthetic Nature Image 7', isPortrait: false }, 
    ];

    /*
    Target Layout:
    Baris 1: [P] | [P] | [L Stacked]
    Baris 2: [P] | [L Stacked] | [P]
    */

    // Mengatur data dalam 2 baris sesuai pola
    const galleryRows = [
        // Baris 1: P1, P2, L4(top), L5(bottom)
        {
            col1: originalImages[0], // ID 1 (P)
            col2: originalImages[1], // ID 2 (P)
            col3_top: originalImages[4], // ID 4 (L Top)
            col3_bottom: originalImages[5], // ID 5 (L Bottom)
            layout: 'P P S', // Potret | Potret | Stacked
        },
        // Baris 2: P3, L6(top), L7(bottom), P8
        {
            col1: originalImages[2], // ID 3 (P)
            col2: originalImages[6], // ID 6 (L Top)
            col3_top: originalImages[7], // ID 7 (L Bottom)
            col3_bottom: originalImages[3], // ID 8 (P) <-- Ini sekarang menjadi gambar Potret
            layout: 'P S P', // Potret | Stacked | Potret
        },
    ];

    const openLightbox = (imageSrc: string) => {
        setSelectedImage(imageSrc);
        document.body.style.overflow = 'hidden'; // Prevent scrolling when lightbox is open
    };

    const closeLightbox = () => {
        setSelectedImage(null);
        document.body.style.overflow = 'auto'; // Re-enable scrolling
    };

    // Komponen Pembantu untuk Gambar (untuk DRY code)
    const GalleryItem: React.FC<{ image: typeof originalImages[0] }> = ({ image }) => (
        <div 
            key={image.id}
            className="relative overflow-hidden rounded-lg cursor-pointer transform transition duration-300 hover:scale-[1.02] group break-inside-avoid"
            onClick={() => openLightbox(image.src)}
        >
            <img 
                src={image.src} 
                alt={image.alt}
                className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2 sm:p-4">
                <p className="text-white text-xs sm:text-sm font-light" style={{fontFamily: "Markazi Text, serif"}}>Klik</p>
            </div>
        </div>
    );

    return (
        <section className="py-20 bg-gradient-to-b from-white to-[#546e7a]"> 
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <div className="mb-4">
                        <img 
                            src="/assets/images/gallerymoment.png" 
                            alt="Gallery Moment" 
                            className="mx-auto max-w-[200px] md:max-w-[280px]"
                        />
                    </div>
                </div>

                {/* GALERI UTAMA: Dibagi menjadi 2 Baris terpisah */}
                <div className="flex flex-col gap-6 max-w-6xl mx-auto">
                    {galleryRows.map((row, rowIndex) => {
                        const isPSPLoading = row.layout === 'P S P';

                        return (
                            <div key={rowIndex} className="grid grid-cols-3 gap-3 sm:gap-6">
                                
                                {/* ------------------------- KOLOM 1 ------------------------- */}
                                {/* Selalu 1 Potret */}
                                <div className="aspect-[2/3]">
                                    <GalleryItem image={row.col1} />
                                </div>

                                {/* ------------------------- KOLOM 2 ------------------------- */}
                                {isPSPLoading ? (
                                    /* Baris 2 (P S P): Kolom 2 adalah Tumpukan Landscape */
                                    <div className="flex flex-col gap-3 sm:gap-6 aspect-[2/3]">
                                        
                                        {/* Landscape Tumpukan Atas (L Top) */}
                                        <div className="flex-1 min-h-0">
                                            <GalleryItem image={row.col2} /> {/* col2 di sini berisi ID 6 */}
                                        </div>

                                        {/* Landscape Tumpukan Bawah (L Bottom) */}
                                        <div className="flex-1 min-h-0">
                                            <GalleryItem image={row.col3_top} /> {/* col3_top di sini berisi ID 7 */}
                                        </div>
                                    </div>
                                ) : (
                                    /* Baris 1 (P P S): Kolom 2 adalah Potret */
                                    <div className="aspect-[2/3]">
                                        <GalleryItem image={row.col2} />
                                    </div>
                                )}

                                {/* ------------------------- KOLOM 3 ------------------------- */}
                                {isPSPLoading ? (
                                    /* Baris 2 (P S P): Kolom 3 adalah Potret */
                                    <div className="aspect-[2/3]">
                                        <GalleryItem image={row.col3_bottom} /> {/* col3_bottom di sini berisi ID 8 */}
                                    </div>
                                ) : (
                                    /* Baris 1 (P P S): Kolom 3 adalah Tumpukan Landscape */
                                    <div className="flex flex-col gap-3 sm:gap-6 aspect-[2/3]">
                                        
                                        {/* Landscape Tumpukan Atas (L Top) */}
                                        <div className="flex-1 min-h-0">
                                            <GalleryItem image={row.col3_top} />
                                        </div>

                                        {/* Landscape Tumpukan Bawah (L Bottom) */}
                                        <div className="flex-1 min-h-0">
                                            <GalleryItem image={row.col3_bottom} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Lightbox */}
                {selectedImage && (
                    <div 
                        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                        onClick={closeLightbox}
                    >
                        <div className="relative max-w-6xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
                            <button
                                className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 z-10 hover:bg-black/75 transition-colors"
                                onClick={closeLightbox}
                                aria-label="Close"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <img 
                                src={selectedImage} 
                                alt="Enlarged view"
                                className="max-h-[85vh] max-w-full object-contain"
                            />
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default GallerySection;
