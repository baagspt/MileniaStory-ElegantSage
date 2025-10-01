# Assets Directory

This directory contains all media assets for the wedding invitation website.

## Directory Structure
- `images/` - All image files (JPG, PNG, GIF, SVG, WebP, etc.)
  - `couple/` - Photos of the couple
  - `gallery/` - Gallery photos
  - `events/` - Event-related images
- `audio/` - All audio files (MP3, WAV, OGG, etc.)
  - `background-music/` - Background music tracks
- `video/` - All video files (MP4, MOV, AVI, WebM, etc.)

## How to Use in Components

### In React Components:
```jsx
// Example usage in a component
import { useState } from 'react';

const MyComponent = () => {
  return (
    <div>
      {/* Using an image from the assets folder */}
      <img src="/assets/images/couple/main-photo.jpg" alt="The Happy Couple" />
      
      {/* Using an audio file */}
      <audio controls>
        <source src="/assets/audio/background-music/wedding-song.mp3" type="audio/mpeg" />
      </audio>
      
      {/* Using a video file */}
      <video controls>
        <source src="/assets/video/welcome-video.mp4" type="video/mp4" />
      </video>
    </div>
  );
};

export default MyComponent;
```

### Best Practices:
- Use descriptive file names
- Optimize images for web (consider file size)
- Use appropriate formats (WebP for images if supported, MP4 for video, MP3 for audio)
- Organize files in subdirectories by category
- Maintain consistent naming conventions
- For images, consider using dimensions in filenames (e.g., `couple-800x600.jpg`)
- For audio, include duration or BPM if relevant (e.g., `ceremony-music-3min.mp3`)

### Using Assets in Components:
When replacing existing remote assets with local ones, update the source path:
- For images in JSX: `src="/assets/images/filename.jpg"`
- For background images in CSS/style: `backgroundImage: "url('/assets/images/filename.jpg')"`
- For audio/video: `src="/assets/audio/filename.mp3"` or `src="/assets/video/filename.mp4"`