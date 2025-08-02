// Variables to store the love letter content
const loveLetter = {
    feelings: {
        love: "the most beautiful thing",
        importance: "the center of my world",
        value: "the queen of my heart"
    },
    promises: [
        "I will love you today, tomorrow, and every single day after that",
        "I promise to be there for you through thick and thin",
        "I will never stop loving you"
    ],
    dreams: [
        "walking together through life's ups and downs",
        "holding each other close",
        "building a love that grows stronger"
    ]
};

// Function to animate the love letter
function animateLoveLetter() {
    // Music controls
    const music = document.getElementById('bgMusic');
    const playBtn = document.getElementById('playBtn');
    const volumeSlider = document.getElementById('volume');

    // Initialize music state
    let isPlaying = false;

    // Try to play music automatically
    function tryAutoPlay() {
        music.muted = true;
        music.play()
            .then(() => {
                music.muted = false;
                isPlaying = true;
                updatePlayButton();
                // Set initial volume from localStorage
                const savedVolume = localStorage.getItem('musicVolume');
                if (savedVolume !== null) {
                    volumeSlider.value = savedVolume;
                    music.volume = parseFloat(savedVolume);
                }
            })
            .catch(e => {
                console.log("Auto-play prevented:", e);
                // If autoplay fails, try to play when user interacts
                document.addEventListener('click', () => {
                    music.muted = false;
                    music.play().then(() => {
                        isPlaying = true;
                        updatePlayButton();
                    });
                }, { once: true });
            });
    }

    // Button control
    playBtn.addEventListener('click', () => {
        if (music.paused) {
            music.play().then(() => {
                isPlaying = true;
                updatePlayButton();
            });
        } else {
            music.pause();
            isPlaying = false;
            updatePlayButton();
        }
    });

    // Volume control
    volumeSlider.addEventListener('input', (e) => {
        music.volume = e.target.value;
        localStorage.setItem('musicVolume', e.target.value);
    });

    // Update play button text and icon
    function updatePlayButton() {
        if (isPlaying) {
            playBtn.innerHTML = '<i class="fas fa-pause"></i> Pause Music';
        } else {
            playBtn.innerHTML = '<i class="fas fa-music"></i> Play Music';
        }
    }

    // Try to auto-play when page loads
    window.addEventListener('load', tryAutoPlay);

    // Audio controls
    const audio = document.getElementById('loveSong');
    const playButton = document.getElementById('playButton');

    // Play audio when play button is clicked
    playButton.addEventListener('click', () => {
        if (audio.paused) {
            audio.play().catch(error => {
                console.error('Error playing audio:', error);
            });
            playButton.innerHTML = '<i class="fas fa-heart-broken"></i> Pause Love Song';
        } else {
            audio.pause();
            playButton.innerHTML = '<i class="fas fa-heart"></i> Play Love Song';
        }
    });

    // Auto-play audio when page loads
    window.addEventListener('load', () => {
        // Check if audio can play
        if (audio) {
            audio.play().catch(error => {
                console.error('Error playing audio:', error);
            });
        }
    });

    // Add hover effect to audio container
    const audioContainer = document.querySelector('.audio-container');
    if (audioContainer) {
        audioContainer.addEventListener('mouseenter', () => {
            audioContainer.style.transform = 'translateY(-2px)';
            audioContainer.style.boxShadow = '0 0 30px rgba(0, 0, 0, 0.4), 0 0 15px rgba(255, 0, 128, 0.3)';
        });

        audioContainer.addEventListener('mouseleave', () => {
            audioContainer.style.transform = 'translateY(0)';
            audioContainer.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.3), 0 0 10px rgba(255, 0, 128, 0.2)';
        });
    }

    // Add volume control
    audio.addEventListener('volumechange', () => {
        localStorage.setItem('audioVolume', audio.volume);
    });

    // Restore volume on page load
    window.addEventListener('load', () => {
        const savedVolume = localStorage.getItem('audioVolume');
        if (savedVolume !== null) {
            audio.volume = parseFloat(savedVolume);
        }
    });

    // Music control
    const volumeIcon = document.getElementById('volumeControl');
    let isMuted = false;

    // Add click event to volume icon
    volumeIcon.addEventListener('click', () => {
        isMuted = !isMuted;
        audio.muted = isMuted;
        volumeIcon.textContent = isMuted ? '🔇' : '🔊';
    });

    // Add play/pause functionality
    audio.addEventListener('play', () => {
        // Function to change floating element images
        function changeFloatingImages() {
            const elements = document.querySelectorAll('.floating-element');
            const currentTime = audio.currentTime;
            const progress = currentTime / audio.duration;
            
            elements.forEach(element => {
                const index = floatingImages.indexOf(element.style.backgroundImage.replace(/url\(['"]?([^'"\)]+)['"]?\)/, '$1'));
                const nextIndex = (index + 1) % floatingImages.length;
                const nextImage = floatingImages[nextIndex];
                
                // Change image with romantic effect
                element.style.backgroundImage = `url('${nextImage}')`;
                
                // Add romantic animation
                const scale = 1.0 + (Math.sin(progress * Math.PI * 2) * 0.1);
                const rotation = (progress * 360);
                element.style.transform = `scale(${scale}) rotate(${rotation}deg)`;
                
                // Add color animation
                const colorProgress = Math.sin(progress * Math.PI * 2) * 0.5 + 0.5;
                element.style.filter = `brightness(${1.2 + colorProgress * 0.2}) contrast(${1.2 + colorProgress * 0.2}) saturate(${1.2 + colorProgress * 0.2})`;
            });
        }

        // Update floating elements with music
        audio.addEventListener('timeupdate', changeFloatingImages);
        
        // Start heart animation when music starts
        document.querySelectorAll('.heart').forEach(heart => {
            heart.style.animationPlayState = 'running';
        });
        
        // Add smooth fade in
        audio.volume = 0;
        const fadeDuration = 2000; // 2 seconds
        const interval = 100;
        
        const fadeStep = 1 / (fadeDuration / interval);
        let currentVolume = 0;
        
        const fadeInterval = setInterval(() => {
            currentVolume += fadeStep;
            audio.volume = currentVolume;
            
            if (currentVolume >= 1) {
                clearInterval(fadeInterval);
            }
        }, interval);
    });

    audio.addEventListener('pause', () => {
        // Pause heart animations when music is paused
        document.querySelectorAll('.heart').forEach(heart => {
            heart.style.animationPlayState = 'paused';
        });
    });

    // Set initial volume
    audio.volume = 0.5;

    // Add error handling and retry mechanism
    audio.addEventListener('error', (event) => {
        console.error('Audio error:', event);
        // Try to play again after a short delay
        setTimeout(() => {
            audio.load();
            audio.play();
        }, 2000);
    });

    // Add manual play button click handler
    const playButton = document.createElement('button');
    playButton.textContent = 'Play Music';
    playButton.style.position = 'fixed';
    playButton.style.top = '10px';
    playButton.style.right = '10px';
    playButton.style.zIndex = '1000';
    playButton.style.padding = '10px 20px';
    playButton.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    playButton.style.borderRadius = '5px';
    playButton.style.border = '1px solid rgba(0, 0, 0, 0.1)';
    playButton.style.cursor = 'pointer';
    playButton.style.transition = 'all 0.3s ease';
    
    playButton.addEventListener('mouseenter', () => {
        playButton.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
    });
    
    playButton.addEventListener('mouseleave', () => {
        playButton.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    });
    
    playButton.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
        } else {
            audio.pause();
        }
    });
    
    document.body.appendChild(playButton);

    // Try to play audio when page loads
    audio.play().catch(error => {
        console.error('Error playing audio:', error);
        // Try again after a short delay
        setTimeout(() => {
            audio.play();
        }, 1000);
    });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Music control
    const audio = document.getElementById('loveSong');
    const volumeIcon = document.getElementById('volumeControl');
    let isMuted = false;
    let isPlaying = false;
    let retryCount = 0;
    const maxRetries = 3;
    let currentSourceIndex = 0;

    // Get all audio sources
    const sources = audio.getElementsByTagName('source');

    // Function to switch to next source
    const switchToNextSource = () => {
        currentSourceIndex = (currentSourceIndex + 1) % sources.length;
        const currentSource = sources[currentSourceIndex];
        audio.src = currentSource.src;
        audio.load();
    };

    // Add click event to volume icon
    volumeIcon.addEventListener('click', () => {
        isMuted = !isMuted;
        audio.muted = isMuted;
        volumeIcon.textContent = isMuted ? '🔇' : '🔊';
    });

    // Add play/pause functionality
    audio.addEventListener('play', () => {
        isPlaying = true;
        // Start heart animation when music starts
        const hearts = document.querySelectorAll('.heart');
        hearts.forEach((heart, index) => {
            // Start each heart with a slight delay
            setTimeout(() => {
                heart.style.animationPlayState = 'running';
                // Adjust animation speed to match the romantic beat
                heart.style.animationDuration = `${Math.random() * 2 + 2.5}s`;
            }, index * 300);
        });
        
        // Add smooth fade in
        audio.volume = 0;
        const fadeDuration = 3000; // 3 seconds for more romantic effect
        const interval = 100;
        
        const fadeStep = 1 / (fadeDuration / interval);
        let currentVolume = 0;
        
        const fadeInterval = setInterval(() => {
            currentVolume += fadeStep;
            audio.volume = currentVolume;
            
            if (currentVolume >= 1) {
                clearInterval(fadeInterval);
            }
        }, interval);
    });

    audio.addEventListener('pause', () => {
        isPlaying = false;
        // Pause heart animations when music is paused
        document.querySelectorAll('.heart').forEach(heart => {
            heart.style.animationPlayState = 'paused';
        });
    });

    // Set initial volume
    audio.volume = 0.4; // Slightly lower volume for romantic effect

    // Add error handling and retry mechanism
    audio.addEventListener('error', (event) => {
        console.error('Audio error:', event);
        retryCount++;
        if (retryCount < maxRetries) {
            switchToNextSource();
            setTimeout(() => {
                audio.play();
            }, 1000);
        } else {
            console.error('Max retries reached. Could not play audio.');
        }
    });

    // Add manual play button click handler
    const playButton = document.createElement('button');
    playButton.textContent = 'Play Music';
    playButton.style.position = 'fixed';
    playButton.style.top = '10px';
    playButton.style.right = '10px';
    playButton.style.zIndex = '1000';
    playButton.style.padding = '10px 20px';
    playButton.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    playButton.style.borderRadius = '5px';
    playButton.style.border = '1px solid rgba(0, 0, 0, 0.1)';
    playButton.style.cursor = 'pointer';
    playButton.style.transition = 'all 0.3s ease';
    
    playButton.addEventListener('mouseenter', () => {
        playButton.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
    });
    
    playButton.addEventListener('mouseleave', () => {
        playButton.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    });
    
    playButton.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
        } else {
            audio.pause();
        }
    });
    
    document.body.appendChild(playButton);

    // Try to play audio when page loads
    audio.addEventListener('canplay', () => {
        retryCount = 0; // Reset retry count on successful load
        audio.play().catch(error => {
            console.error('Error playing audio:', error);
            // Try again after a short delay
            setTimeout(() => {
                audio.play();
            }, 1000);
        });
    });

    // Add romantic heart animation sync
    audio.addEventListener('timeupdate', () => {
        const currentTime = audio.currentTime;
        const duration = audio.duration;
        const progress = currentTime / duration;

        const romanticProgress = Math.sin(currentTime / audio.duration * Math.PI * 2);

        // Apply romantic effects to all images
        images.forEach((image) => {
            // Add romantic overlay
            image.style.filter = `brightness(${1.5 + romanticProgress * 0.3}) contrast(${1.5 + romanticProgress * 0.3}) saturate(${1.5 + romanticProgress * 0.3})`;

            // Add glow effect
            const glowIntensity = Math.abs(romanticProgress) * 20;
            image.style.boxShadow = `0 0 ${glowIntensity}px rgba(255, 0, 128, ${romanticProgress * 0.5})`;

            // Add outline for better visibility
            image.style.outline = `5px solid rgba(255, 255, 255, ${romanticProgress * 0.3})`;
            image.style.outlineOffset = '-5px';

            // Add slight scale animation
            const scale = 1.02 + (Math.sin(romanticProgress * Math.PI * 2) * 0.02);
            image.style.transform = `scale(${scale})`;
        });

        // Update romantic overlay glow
        const overlay = document.querySelector('.romantic-overlay');
        const glowIntensity = Math.sin(progress * Math.PI * 2) * 0.1 + 0.2;
        overlay.style.background = `linear-gradient(45deg, 
            rgba(255, 0, 128, ${glowIntensity}), 
            rgba(255, 0, 128, ${glowIntensity * 1.5}), 
            rgba(255, 0, 128, ${glowIntensity}))`;
    });

    // Add event listener for user interaction
    document.addEventListener('click', () => {
        if (!isPlaying) {
            audio.play();
        }
    });

    // Force play on load with multiple attempts
    const playWithRetries = () => {
        audio.play().catch(error => {
            console.error('Initial play attempt failed:', error);
            retryCount++;
            if (retryCount < maxRetries) {
                setTimeout(() => {
                    playWithRetries();
                }, 1000);
            } else {
                console.error('Max retries reached. Could not play audio.');
            }
        });
    };
    
    playWithRetries();
});

// Add typing effect to the title
const title = document.querySelector('title');
if (title) {
    title.textContent = '';
    let i = 0;
    const typing = setInterval(() => {
            if (i < 'Love Letter in Code'.length) {
                title.textContent += 'Love Letter in Code'.charAt(i);
                i++;
            } else {
                clearInterval(typing);
            }
        }, 50);
    }
    
    // Start the love letter animation
    animateLoveLetter();

    // Add YouTube IFrame API
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = function() {
        const player = new YT.Player('loveSong', {
            videoId: 'UeZ6Q4H63BQ',
            events: {
                'onReady': function(event) {
                    event.target.playVideo();
                }
            }
        });
    };


// Function to add a typing effect
function typeWriter(element, text, delay = 50) {
    let i = 0;
    const typing = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(typing);
        }
    }, delay);
}

// Function to create a heart animation
function createHeartAnimation() {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.style.left = `${Math.random() * 100}vw`;
    heart.style.animationDuration = `${Math.random() * 2 + 2}s`;
    document.body.appendChild(heart);
    
    setTimeout(() => heart.remove(), 4000);
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
    
    // Show first slide immediately
    slides[currentSlide].classList.add('active');
    
    // Change slide every 5 seconds
    setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
        console.log(`Now showing slide ${currentSlide}`);
    }, 5000);
    
    // Add heart animations when clicking
    document.body.addEventListener('click', createHeartAnimation);
    
    // Add typing effect to the title
    const title = document.querySelector('title');
    if (title) {
        title.textContent = '';
        typeWriter(title, 'Love Letter in Code');
    }
    
    // Start the love letter animation
    animateLoveLetter();
});
