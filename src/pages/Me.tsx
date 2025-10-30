import { useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LondonWidget } from '../components/LondonWidget';
import './Me.css';

export const Me = () => {
  const [showCopied, setShowCopied] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [fadeInOriginal, setFadeInOriginal] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText('dandanaher.dev@gmail.com');
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  const playBubblePopSound = () => {
    try {
      // Try to play the audio file first
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {
          // If file doesn't exist, generate procedural sound
          generateBubblePop();
        });
      } else {
        generateBubblePop();
      }
    } catch (err) {
      generateBubblePop();
    }
  };

  const generateBubblePop = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

    // Create oscillator for the "pop"
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Start with a low frequency and quickly rise
    oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.05);

    // Quick fade out
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);

    oscillator.type = 'sine';
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.05);
  };

  const handleProfileClick = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    setFadeInOriginal(false);

    // Play bubble pop sound
    playBubblePopSound();

    // Restore original after 10 seconds
    setTimeout(() => {
      setFadeInOriginal(true);
      setTimeout(() => {
        setIsAnimating(false);
        setFadeInOriginal(false);
      }, 1000);
    }, 10000);
  };

  return (
    <div className="me-page">
      <LondonWidget />
      <audio ref={audioRef} src="/sounds/bubble-pop.mp3" preload="auto" />
      <div className="profile-section">
        <div className="profile-picture-container">
          <img
            src="/images/face.jpg"
            alt="Face"
            className="profile-face"
          />
          <img
            src="/images/favicon.png"
            alt="Dan Danaher profile"
            className={`profile-picture ${isAnimating ? 'profile-picture-pop' : ''} ${fadeInOriginal ? 'profile-picture-fadein' : ''}`}
            onClick={handleProfileClick}
            style={{ cursor: 'pointer' }}
          />
        </div>
        <div className="profile-info">
          <h1 className="profile-name">dan danaher</h1>
          <p className="profile-subtitle">
            aerospace engineering student. 21, based in London.
          </p>
          <div className="social-links">
            <a
              href="https://github.com/dandanaher"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
              aria-label="GitHub"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            </a>
            <a
              href="https://x.com/devDanaher"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
              aria-label="X/Twitter"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <div className="email-icon-container">
              <button
                onClick={handleCopyEmail}
                className="social-icon"
                aria-label="Copy email address"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </button>
              <AnimatePresence>
                {showCopied && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="copied-popup"
                  >
                    Email copied!
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
