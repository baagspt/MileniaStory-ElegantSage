// Wedding Website JavaScript Functionality

// Initialize Milenia Elegant cursor
function initMileniaElegantCursor() {
    // Create cursor elements
    const cursorDot = document.createElement('div');
    const cursorOutline = document.createElement('div');
    
    cursorDot.className = 'cursor-dot';
    cursorOutline.className = 'cursor-outline';
    
    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorOutline);
    
    let posX = 0, posY = 0;
    let dotX = 0, dotY = 0;
    let mouseX = 0, mouseY = 0;
    
    // Mouse move event
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Animation loop for smooth cursor movement
    const animate = () => {
        // Calculate distance between dot and outline
        const distX = mouseX - dotX;
        const distY = mouseY - dotY;
        
        // Update dot position with less damping for responsiveness
        dotX += distX * 0.15;
        dotY += distY * 0.15;
        
        // Update positions
        cursorDot.style.left = `${dotX}px`;
        cursorDot.style.top = `${dotY}px`;
        cursorOutline.style.left = `${mouseX}px`;
        cursorOutline.style.top = `${mouseY}px`;
        
        requestAnimationFrame(animate);
    };
    
    animate();
    
    // Add hover effects
    document.addEventListener('mouseover', (e) => {
        if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.classList.contains('gallery-item')) {
            cursorDot.classList.add('hover');
            cursorOutline.classList.add('hover');
        }
    });
    
    document.addEventListener('mouseout', (e) => {
        if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.classList.contains('gallery-item')) {
            cursorDot.classList.remove('hover');
            cursorOutline.classList.remove('hover');
        }
    });
    
    // Add click effects
    document.addEventListener('mousedown', () => {
        cursorDot.classList.add('active');
        cursorOutline.classList.add('active');
    });
    
    document.addEventListener('mouseup', () => {
        cursorDot.classList.remove('active');
        cursorOutline.classList.remove('active');
    });
}

// DOM Elements
const loadingScreen = document.getElementById('loading-screen');
const coverScreen = document.getElementById('cover');
const openInvitationBtn = document.getElementById('open-invitation');
const bgMusic = document.getElementById('bg-music');
const musicToggleBtn = document.getElementById('music-toggle');
const guestNameSpan = document.getElementById('guest-name');
const countdownDisplay = {
    days: document.getElementById('days'),
    hours: document.getElementById('hours'),
    minutes: document.getElementById('minutes'),
    seconds: document.getElementById('seconds')
};
const rsvpForm = document.getElementById('rsvp-form');

// Wedding date (adjust this to your actual wedding date)
const weddingDate = new Date('August 12, 2025 08:00:00').getTime();

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Milenia Elegant cursor
    initMileniaElegantCursor();
    
    // Handle URL parameters for guest name
    handleGuestName();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize music button state
    updateMusicButton(false); // Initially paused
    
    // Start countdown timer
    updateCountdown();
    setInterval(updateCountdown, 1000);
    
    // Simulate loading completion after 2 seconds
    setTimeout(() => {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 1000);
    }, 2000);
});

// Handle guest name from URL parameter
function handleGuestName() {
    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get('to');
    
    if (guestName && guestName.trim() !== '') {
        guestNameSpan.textContent = guestName;
    }
}

// Set up event listeners
function setupEventListeners() {
    // Open invitation button
    openInvitationBtn.addEventListener('click', function() {
        // Play background music (with user interaction)
        bgMusic.play().catch(e => console.log('Autoplay prevented:', e));
        
        // Scroll to next section
        document.getElementById('couple').scrollIntoView({
            behavior: 'smooth'
        });
        
        // Add animation class to cover
        coverScreen.classList.add('slide-up');
    });
    
    // Music toggle button
    musicToggleBtn.addEventListener('click', function() {
        if (bgMusic.paused) {
            bgMusic.play().then(() => {
                updateMusicButton(true);
            }).catch(e => {
                console.log('Autoplay prevented:', e);
                updateMusicButton(false);
            });
        } else {
            bgMusic.pause();
            updateMusicButton(false);
        }
    });
    
    // RSVP form submission
    rsvpForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const attendance = document.querySelector('input[name="attendance"]:checked').value;
        const message = document.getElementById('message').value;
        
        // In a real implementation, you would send this data to a server
        // For now, we'll just add it to the messages list
        
        // Create message element
        const messageItem = document.createElement('div');
        messageItem.className = 'message-item';
        
        // Attendance status text
        const statusText = attendance === 'yes' ? 'Hadir' : 
                          attendance === 'no' ? 'Tidak Hadir' : 'Belum Pasti';
        const statusClass = attendance === 'yes' ? 'yes' : 
                           attendance === 'no' ? 'no' : 'maybe';
        
        messageItem.innerHTML = `
            <div class="message-header">
                <strong>${name}</strong>
                <span class="attendance-status ${statusClass}">${statusText}</span>
            </div>
            <p>${message}</p>
        `;
        
        // Add to messages list
        document.getElementById('messages-list').prepend(messageItem);
        
        // Reset form
        rsvpForm.reset();
        
        // Show confirmation message
        alert('Ucapan dan konfirmasi kehadiran Anda telah terkirim. Terima kasih!');
    });
    
    // Copy account number functionality
    document.querySelectorAll('.btn-copy').forEach(button => {
        button.addEventListener('click', function() {
            const accountNumber = this.previousElementSibling.previousElementSibling.textContent;
            copyToClipboard(accountNumber);
            this.textContent = 'Tersalin!';
            setTimeout(() => {
                this.textContent = 'Salin Nomor Rekening';
            }, 2000);
        });
    });
}

// Countdown timer function
function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now;
    
    // Calculate days, hours, minutes, seconds
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    // Update display
    if (distance > 0) {
        countdownDisplay.days.textContent = formatTime(days);
        countdownDisplay.hours.textContent = formatTime(hours);
        countdownDisplay.minutes.textContent = formatTime(minutes);
        countdownDisplay.seconds.textContent = formatTime(seconds);
    } else {
        // Wedding date has passed
        Object.values(countdownDisplay).forEach(element => {
            element.textContent = '00';
        });
    }
}

// Format time to always have 2 digits
function formatTime(time) {
    return time < 10 ? `0${time}` : time;
}

// Copy to clipboard function
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).catch(err => {
        console.error('Could not copy text: ', err);
    });
}

// Function to copy account number (for button onclick)
function copyAccount(accountNumber) {
    copyToClipboard(accountNumber);
}

// Update music button state
function updateMusicButton(isPlaying) {
    if (isPlaying) {
        musicToggleBtn.classList.add('playing');
        musicToggleBtn.classList.remove('paused');
        musicToggleBtn.setAttribute('title', 'Pause Music');
    } else {
        musicToggleBtn.classList.add('paused');
        musicToggleBtn.classList.remove('playing');
        musicToggleBtn.setAttribute('title', 'Play Music');
    }
}

// Add smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Gallery lightbox functionality (optional enhancement)
function setupGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const imgSrc = this.querySelector('img').src;
            const alt = this.querySelector('img').alt;
            
            // Create lightbox overlay
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox-overlay';
            lightbox.innerHTML = `
                <div class="lightbox-content">
                    <span class="close-btn">&times;</span>
                    <img src="${imgSrc}" alt="${alt}">
                </div>
            `;
            
            document.body.appendChild(lightbox);
            
            // Close lightbox when clicking close button or overlay
            lightbox.querySelector('.close-btn').addEventListener('click', function() {
                document.body.removeChild(lightbox);
            });
            
            lightbox.addEventListener('click', function(e) {
                if (e.target === lightbox) {
                    document.body.removeChild(lightbox);
                }
            });
        });
    });
}

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', setupGallery);