import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

// ===============================================
// 1. TYPE DEFINITIONS
// ===============================================

interface MediaItemType {
    id: number;
    type: string; // 'image' atau 'video'
    title: string;
    desc: string;
    url: string;
    span: string; // Tailwind grid span classes
}

// ===============================================
// 2. MEDIA ITEM COMPONENT (Displaying Image/Video in Grid)
// ===============================================

const MediaItem = ({ item, className, onClick }: { item: MediaItemType, className?: string, onClick?: () => void }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isInView, setIsInView] = useState(false);
    const [isBuffering, setIsBuffering] = useState(true);

    // Intersection Observer untuk memutar/menghentikan video
    useEffect(() => {
        const options = {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                setIsInView(entry.isIntersecting);
            });
        }, options);

        if (videoRef.current) {
            observer.observe(videoRef.current);
        }

        return () => {
            if (videoRef.current) {
                observer.unobserve(videoRef.current);
            }
        };
    }, []);

    // Logika Play/Pause Video
    useEffect(() => {
        let mounted = true;

        const handleVideoPlay = async () => {
            if (!videoRef.current || !isInView || !mounted) return;

            try {
                if (videoRef.current.readyState >= 3) {
                    setIsBuffering(false);
                    await videoRef.current.play();
                } else {
                    setIsBuffering(true);
                    await new Promise<void>((resolve) => {
                        if (videoRef.current) {
                            // Menambahkan event listener tunggal untuk 'canplay'
                            const onCanPlay = () => {
                                videoRef.current?.removeEventListener('canplay', onCanPlay);
                                resolve();
                            };
                            videoRef.current.addEventListener('canplay', onCanPlay);
                        }
                    });
                    if (mounted) {
                        setIsBuffering(false);
                        await videoRef.current.play();
                    }
                }
            } catch (error) {
                // Warning jika video tidak dapat diputar otomatis (misal karena batasan browser)
                // console.warn("Video playback failed:", error);
                if (mounted) {
                    setIsBuffering(false);
                }
            }
        };

        if (isInView) {
            handleVideoPlay();
        } else if (videoRef.current) {
            videoRef.current.pause();
        }

        return () => {
            mounted = false;
            // Bersihkan sumber daya video saat tidak digunakan
            if (videoRef.current) {
                videoRef.current.pause();
                // Menggunakan .src = '' dan .load() adalah praktik yang baik
                // tetapi menghapus atribut src lebih aman untuk beberapa browser.
            }
        };
    }, [isInView]); // Dependencies: isInView

    if (item.type === 'video') {
        return (
            <div className={`${className} relative overflow-hidden bg-gray-900/10`}>
                <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    onClick={onClick}
                    playsInline
                    muted
                    loop
                    preload="auto"
                    style={{
                        opacity: isBuffering ? 0.8 : 1,
                        transition: 'opacity 0.2s',
                    }}
                >
                    <source src={item.url} type="video/mp4" />
                </video>
                {isBuffering && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    </div>
                )}
            </div>
        );
    }

    return (
        <img
            src={item.url}
            alt={item.title}
            className={`${className} object-cover cursor-pointer`}
            onClick={onClick}
            loading="lazy"
            decoding="async"
        />
    );
};

// ===============================================
// 3. GALLERY MODAL COMPONENT (Displaying Selected Item)
// ===============================================

interface GalleryModalProps {
    selectedItem: MediaItemType;
    isOpen: boolean;
    onClose: () => void;
    setSelectedItem: (item: MediaItemType | null) => void;
    mediaItems: MediaItemType[];
}

const GalleryModal = ({ selectedItem, isOpen, onClose, setSelectedItem, mediaItems }: GalleryModalProps) => {
    const [dockPosition, setDockPosition] = useState({ x: 0, y: 0 });

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[50]"
        >
            {/* Main Modal Area */}
            <motion.div
                initial={{ scale: 0.98 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.98 }}
                transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30
                }}
                className="w-full min-h-screen sm:h-[90vh] md:h-[600px] 
                         rounded-none sm:rounded-lg md:rounded-xl overflow-hidden z-10 
                         flex flex-col max-w-5xl max-h-[90vh] relative" // Tambahkan max-width dan relative
            >
                {/* Close Button */}
                <motion.button
                    className="absolute top-2 sm:top-2.5 md:top-3 right-2 sm:right-2.5 md:right-3 
                               p-2 rounded-full bg-gray-200/80 text-gray-700 hover:bg-gray-300/80 
                               text-xs sm:text-sm backdrop-blur-sm z-20"
                    onClick={onClose}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <X className='w-4 h-4' />
                </motion.button>
                
                {/* Main Content */}
                <div className="flex-1 flex items-center justify-center bg-gray-50/50">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selectedItem.id}
                            className="relative w-full aspect-[16/9] max-w-[95%] sm:max-w-[85%] md:max-w-3xl 
                                     h-auto max-h-[70vh] rounded-lg overflow-hidden shadow-md"
                            initial={{ y: 20, scale: 0.97 }}
                            animate={{
                                y: 0,
                                scale: 1,
                                transition: {
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 30,
                                    mass: 0.5
                                }
                            }}
                            exit={{
                                y: 20,
                                scale: 0.97,
                                transition: { duration: 0.15 }
                            }}
                        >
                            <MediaItem item={selectedItem} className="w-full h-full object-contain bg-gray-900/20" />
                            <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 md:p-4 
                                         bg-gradient-to-t from-black/70 to-transparent">
                                <h3 className="text-white text-base sm:text-lg md:text-xl font-semibold">
                                    {selectedItem.title}
                                </h3>
                                <p className="text-white/80 text-xs sm:text-sm mt-1">
                                    {selectedItem.desc}
                                </p>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* Draggable Dock */}
            <motion.div
                drag
                dragMomentum={false}
                dragElastic={0.1}
                initial={false}
                animate={{ x: dockPosition.x, y: dockPosition.y }}
                onDragEnd={(_, info) => { // Menggunakan '_' untuk event
                    setDockPosition(prev => ({
                        x: prev.x + info.offset.x,
                        y: prev.y + info.offset.y
                    }));
                }}
                className="fixed z-[51] left-1/2 bottom-4 -translate-x-1/2 touch-none"
            >
                <motion.div
                    className="relative rounded-xl bg-sky-400/20 backdrop-blur-xl 
                                 border border-blue-400/30 shadow-lg
                                 cursor-grab active:cursor-grabbing"
                >
                    <div className="flex items-center -space-x-2 px-3 py-2">
                        {mediaItems.map((item, index) => (
                            <motion.div
                                key={item.id}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedItem(item);
                                }}
                                style={{
                                    zIndex: selectedItem.id === item.id ? 30 : mediaItems.length - index,
                                }}
                                className={`
                                    relative group
                                    w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex-shrink-0 
                                    rounded-lg overflow-hidden 
                                    cursor-pointer hover:z-20
                                    ${selectedItem.id === item.id
                                        ? 'ring-2 ring-white/70 shadow-lg'
                                        : 'hover:ring-2 hover:ring-white/30'}
                                `}
                                initial={{ rotate: index % 2 === 0 ? -15 : 15 }}
                                animate={{
                                    scale: selectedItem.id === item.id ? 1.2 : 1,
                                    rotate: selectedItem.id === item.id ? 0 : index % 2 === 0 ? -15 : 15,
                                    y: selectedItem.id === item.id ? -8 : 0,
                                }}
                                whileHover={{
                                    scale: 1.3,
                                    rotate: 0,
                                    y: -10,
                                    transition: { type: "spring", stiffness: 400, damping: 25 }
                                }}
                            >
                                <MediaItem item={item} className="w-full h-full" onClick={() => setSelectedItem(item)} />
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-white/20" />
                                {selectedItem.id === item.id && (
                                    <motion.div
                                        layoutId="activeGlow"
                                        className="absolute -inset-2 bg-white/20 blur-xl"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.2 }}
                                    />
                                )}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

// ===============================================
// 4. MAIN GALLERY COMPONENT
// ===============================================

interface InteractiveBentoGalleryProps {
    // Prop yang wajib ada berdasarkan error sebelumnya
    items: MediaItemType[]
    title: string
    description: string
}

const InteractiveBentoGallery: React.FC<InteractiveBentoGalleryProps> = ({ items, title, description }) => {
    const [selectedItem, setSelectedItem] = useState<MediaItemType | null>(null);
    const [currentItems, setCurrentItems] = useState(items);
    const [isDragging, setIsDragging] = useState(false);

    // Sinkronisasi prop 'items' ke state 'currentItems' jika data berubah dari luar
    useEffect(() => {
        setCurrentItems(items);
    }, [items]);

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Header dan Description, menggunakan prop title dan description */}
            <div className="mb-8 text-center">
                <motion.h1
                    className="text-2xl sm:text-3xl md:text-4xl font-bold bg-clip-text text-transparent 
                             bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900
                             dark:from-white dark:via-gray-200 dark:to-white"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {title}
                </motion.h1>
                <motion.p
                    className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    {description}
                </motion.p>
            </div>
            
            {/* Grid dan Modal Logic */}
            <AnimatePresence mode="wait">
                {selectedItem ? (
                    <GalleryModal
                        selectedItem={selectedItem}
                        isOpen={true}
                        onClose={() => setSelectedItem(null)}
                        setSelectedItem={setSelectedItem}
                        mediaItems={currentItems}
                    />
                ) : (
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-3 auto-rows-[60px]"
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: { staggerChildren: 0.1 }
                            }
                        }}
                    >
                        {currentItems.map((item, index) => (
                            <motion.div
                                key={item.id}
                                layoutId={`media-${item.id}`}
                                className={`relative overflow-hidden rounded-xl cursor-move ${item.span}`}
                                onClick={() => !isDragging && setSelectedItem(item)}
                                variants={{
                                    hidden: { y: 50, scale: 0.9, opacity: 0 },
                                    visible: {
                                        y: 0,
                                        scale: 1,
                                        opacity: 1,
                                        transition: {
                                            type: "spring",
                                            stiffness: 350,
                                            damping: 25,
                                            delay: index * 0.05
                                        }
                                    }
                                }}
                                whileHover={{ scale: 1.02 }}
                                drag
                                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                                dragElastic={0.5} // Mengurangi sensitivitas drag
                                onDragStart={() => setIsDragging(true)}
                                onDragEnd={(_, info) => { // Menggunakan '_' untuk event
                                    setIsDragging(false);
                                    // Hanya memicu logika drag/sort jika pergerakan melebihi 10 piksel
                                    if (Math.abs(info.offset.x) > 10 || Math.abs(info.offset.y) > 10) {
                                        const moveDistance = info.offset.x + info.offset.y;
                                        const newItems = [...currentItems];
                                        const draggedItem = newItems[index];
                                        // Logika penyortiran (ini sederhana dan mungkin perlu disesuaikan 
                                        // untuk grid yang kompleks)
                                        const targetIndex = moveDistance > 0 ?
                                            Math.min(index + 1, currentItems.length - 1) :
                                            Math.max(index - 1, 0);
                                            
                                        if (index !== targetIndex) {
                                            newItems.splice(index, 1);
                                            newItems.splice(targetIndex, 0, draggedItem);
                                            setCurrentItems(newItems);
                                        }
                                    }
                                }}
                            >
                                <MediaItem
                                    item={item}
                                    className="absolute inset-0 w-full h-full"
                                    onClick={() => !isDragging && setSelectedItem(item)}
                                />
                                <motion.div
                                    className="absolute inset-0 flex flex-col justify-end p-2 sm:p-3 md:p-4"
                                    initial={{ opacity: 0 }}
                                    whileHover={{ opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="absolute inset-0 flex flex-col justify-end p-2 sm:p-3 md:p-4">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                                        <h3 className="relative text-white text-xs sm:text-sm md:text-base font-medium line-clamp-1">
                                            {item.title}
                                        </h3>
                                        <p className="relative text-white/70 text-[10px] sm:text-xs md:text-sm mt-0.5 line-clamp-2">
                                            {item.desc}
                                        </p>
                                    </div>
                                </motion.div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};


export default InteractiveBentoGallery;