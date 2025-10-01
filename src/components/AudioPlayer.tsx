import { useEffect, useRef } from 'react';

interface AudioPlayerProps {
  src: string;
  isPlaying: boolean;
  onPlayPause: () => void;
}

const AudioPlayer = ({ src, isPlaying, onPlayPause }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);



  // Effect to handle changes in isPlaying prop
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        // When isPlaying is true, try to play the audio
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              // Successfully started playing
              console.log('Music started playing');
            })
            .catch(error => {
              console.log('Play failed (this is expected in some browsers until user interacts):', error);
              // Don't change the state here as user intent was to play
            });
        }
      } else {
        // When isPlaying is false, pause the audio
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Handle the button click
  const handleClick = () => {
    onPlayPause(); // This toggles the state in the parent component
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center">
      {/* Audio element */}
      <audio 
        ref={audioRef} 
        loop
        src={src}
        // We don't display the default player controls
      />
      
      {/* Audio visualization indicator */}
      {isPlaying && (
        <div className="flex items-center mr-2">
          <div className="h-2 w-1 bg-amber-400 rounded-full mr-0.5 animate-pulse"></div>
          <div className="h-2 w-1 bg-amber-400 rounded-full mr-0.5 animate-pulse delay-75"></div>
          <div className="h-2 w-1 bg-amber-400 rounded-full mr-0.5 animate-pulse delay-150"></div>
          <div className="h-2 w-1 bg-amber-400 rounded-full animate-pulse delay-300"></div>
        </div>
      )}
      
      {/* Custom play/pause button */}
      <button
        onClick={handleClick}
        className={`p-3 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${
          isPlaying 
            ? 'bg-amber-500 text-white hover:bg-amber-600' 
            : 'bg-gray-800 text-gray-200 hover:bg-gray-700'
        }`}
        aria-label={isPlaying ? 'Pause music' : 'Play music'}
      >
        {isPlaying ? (
          // Pause icon
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        ) : (
          // Play icon
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default AudioPlayer;