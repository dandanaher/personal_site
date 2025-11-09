import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { LondonWidget } from '../components/LondonWidget';

// --- Physics Types ---
interface PhysicsState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationVelocity: number;
}

interface VelocityPoint {
  x: number;
  y: number;
  time: number;
}

export const Me = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [fadeInOriginal, setFadeInOriginal] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // --- Alternating Effect State ---
  const [nextEffect, setNextEffect] = useState<'pop' | 'physics'>('pop');

  // --- Physics State (Restored from Original) ---
  const [isPhysicsMode, setIsPhysicsMode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isNearSnapZone, setIsNearSnapZone] = useState(false);
  const [usesAccelerometer, setUsesAccelerometer] = useState(false);
  const [physics, setPhysics] = useState<PhysicsState>({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    rotation: 0,
    rotationVelocity: 0,
  });

  // --- Physics Refs (Restored from Original) ---
  const physicsIconRef = useRef<HTMLDivElement>(null);
  const placeholderRef = useRef<HTMLImageElement>(null);
  const clickableIconRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const velocityHistory = useRef<VelocityPoint[]>([]);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const lastMousePos = useRef({ x: 0, y: 0, time: 0 });
  const audioContextRef = useRef<AudioContext | null>(null);
  const lastCollisionTime = useRef<number>(0);
  const originalPosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const currentPhysics = useRef<PhysicsState>(physics);
  const isOnGround = useRef(false); // Crucial for rolling logic

  // --- Physics Constants ---
  const GRAVITY = 0.5;
  const BOUNCE_DAMPING = 0.7;
  const AIR_FRICTION = 0.99;
  const ROLLING_FRICTION = 0.98;
  const ICON_SIZE = 130;
  const VELOCITY_HISTORY_LENGTH = 5;
  const MIN_COLLISION_INTERVAL = 50;
  const ROLLING_THRESHOLD = 2;
  const SNAP_DISTANCE = 80;

  const playBubblePopSound = () => {
    try {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {
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
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.05);
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
    oscillator.type = 'sine';
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.05);
  };

  // --- Physics Helper Functions ---

  // =================================================================
  // FIX 1: Replaced procedural sound with the original complex version
  // =================================================================
  const playCollisionSound = (impactVelocity: number) => {
    if (!audioContextRef.current) return;

    const now = Date.now();
    if (now - lastCollisionTime.current < MIN_COLLISION_INTERVAL) return;
    lastCollisionTime.current = now;

    const audioContext = audioContextRef.current;

    const volume = Math.min(Math.abs(impactVelocity) / 20, 1) * 0.25;
    if (volume < 0.02) return; // This check fixes the rolling sound bug

    const gainNode = audioContext.createGain();
    gainNode.connect(audioContext.destination);
    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);

    const startTime = audioContext.currentTime;
    const randomness = Math.random() * 0.1 + 0.95;

    const osc1 = audioContext.createOscillator();
    const osc1Gain = audioContext.createGain();
    const baseFreq = (490 + (impactVelocity * 20)) * randomness;

    osc1.frequency.setValueAtTime(baseFreq, startTime);
    osc1.frequency.exponentialRampToValueAtTime(baseFreq * 0.68, startTime + 0.075);
    osc1.type = "sine";

    osc1Gain.gain.setValueAtTime(0, startTime);
    osc1Gain.gain.linearRampToValueAtTime(volume * 0.48, startTime + 0.0025);
    osc1Gain.gain.exponentialRampToValueAtTime(volume * 0.14, startTime + 0.023);
    osc1Gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.09);

    const osc2 = audioContext.createOscillator();
    const osc2Gain = audioContext.createGain();
    const harmonic = baseFreq * 1.46 * (1 + (Math.random() - 0.5) * 0.03);

    osc2.frequency.setValueAtTime(harmonic, startTime);
    osc2.frequency.exponentialRampToValueAtTime(harmonic * 0.69, startTime + 0.0575);
    osc2.type = "sine";

    osc2Gain.gain.setValueAtTime(0, startTime);
    osc2Gain.gain.linearRampToValueAtTime(volume * 0.27, startTime + 0.002);
    osc2Gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.063);

    const osc3 = audioContext.createOscillator();
    const osc3Gain = audioContext.createGain();
    const inharmonic = baseFreq * 2.05 * randomness;

    osc3.frequency.setValueAtTime(inharmonic, startTime);
    osc3.frequency.exponentialRampToValueAtTime(inharmonic * 0.62, startTime + 0.0375);
    osc3.type = "sine";

    osc3Gain.gain.setValueAtTime(0, startTime);
    osc3Gain.gain.linearRampToValueAtTime(volume * 0.13, startTime + 0.0012);
    osc3Gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.042);

    const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.022, audioContext.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseData.length; i++) {
      const decay = Math.exp(-i / (noiseData.length * 0.085));
      const amplitude = (Math.random() * 2 - 1) * decay * 0.38;
      noiseData[i] = amplitude;
    }
    const noiseSource = audioContext.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const bandpass = audioContext.createBiquadFilter();
    bandpass.type = "bandpass";
    bandpass.frequency.setValueAtTime(baseFreq * 1.15, startTime);
    bandpass.Q.setValueAtTime(1.6, startTime);

    const lowOsc = audioContext.createOscillator();
    const lowGain = audioContext.createGain();
    lowOsc.frequency.setValueAtTime(baseFreq * 0.5, startTime);
    lowOsc.type = "triangle";

    lowGain.gain.setValueAtTime(0, startTime);
    lowGain.gain.linearRampToValueAtTime(volume * 0.14, startTime + 0.0045);
    lowGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.042);

    osc1.connect(osc1Gain);
    osc2.connect(osc2Gain);
    osc3.connect(osc3Gain);
    lowOsc.connect(lowGain);
    noiseSource.connect(bandpass);

    osc1Gain.connect(gainNode);
    osc2Gain.connect(gainNode);
    osc3Gain.connect(gainNode);
    lowGain.connect(gainNode);
    bandpass.connect(gainNode);

    osc1.start(startTime);
    osc2.start(startTime);
    osc3.start(startTime);
    lowOsc.start(startTime);
    noiseSource.start(startTime);

    osc1.stop(startTime + 0.11);
    osc2.stop(startTime + 0.075);
    osc3.stop(startTime + 0.052);
    lowOsc.stop(startTime + 0.05);
    noiseSource.stop(startTime + 0.022);
  };

  // =================================================================
  // FIX 2: Replaced collision detection with original pixel-perfect logic
  // =================================================================
  const checkPixelCollision = (x: number, y: number, radius: number) => {
    const collisions: Array<{
      element: HTMLElement;
      side: "left" | "right" | "top" | "bottom";
      distance: number;
    }> = [];

    // --- UPDATED QUERY SELECTOR ---
    const targets = document.querySelectorAll(
      "h1, p, a[href], button[aria-label], svg"
    );

    targets.forEach((element) => {
      const htmlElement = element as HTMLElement;

      if (physicsIconRef.current?.contains(htmlElement)) return;
      if (placeholderRef.current === htmlElement) return;

      const rect = htmlElement.getBoundingClientRect();

      const iconLeft = x - radius;
      const iconRight = x + radius;
      const iconTop = y - radius;
      const iconBottom = y + radius;

      const isNearby =
        iconRight > rect.left - 10 &&
        iconLeft < rect.right + 10 &&
        iconBottom > rect.top - 10 &&
        iconTop < rect.bottom + 10;

      if (!isNearby) return;

      // Use tighter bounds for text elements
      if (
        htmlElement.tagName === "H1" ||
        htmlElement.tagName === "P" ||
        htmlElement.tagName === "A" ||
        htmlElement.tagName === "BUTTON"
      ) {
        const range = document.createRange();
        const textNode = htmlElement.childNodes[0];
        if (textNode && textNode.nodeType === Node.TEXT_NODE) {
          range.selectNodeContents(htmlElement);
          const textRect = range.getBoundingClientRect();

          const isColliding =
            iconRight > textRect.left &&
            iconLeft < textRect.right &&
            iconBottom > textRect.top &&
            iconTop < textRect.bottom;

          if (isColliding) {
            const distances = {
              left: iconRight - textRect.left,
              right: textRect.right - iconLeft,
              top: iconBottom - textRect.top,
              bottom: textRect.bottom - iconTop,
            };

            const minSide = Object.entries(distances).reduce((min, [side, dist]) =>
              dist < min.dist ? { side: side as any, dist } : min
            , { side: "top" as const, dist: Infinity });

            collisions.push({
              element: htmlElement,
              side: minSide.side,
              distance: minSide.dist,
            });
          }
        }
      } else {
        // Standard bounds for SVGs and other elements
        const isColliding =
          iconRight > rect.left &&
          iconLeft < rect.right &&
          iconBottom > rect.top &&
          iconTop < rect.bottom;

        if (isColliding) {
          const distances = {
            left: iconRight - rect.left,
            right: rect.right - iconLeft,
            top: iconBottom - rect.top,
            bottom: rect.bottom - iconTop,
          };

          const minSide = Object.entries(distances).reduce((min, [side, dist]) =>
            dist < min.dist ? { side: side as any, dist } : min
          , { side: "top" as const, dist: Infinity });

          collisions.push({
            element: htmlElement,
            side: minSide.side,
            distance: minSide.dist,
          });
        }
      }
    });

    return collisions.length > 0
      ? collisions.reduce((closest, col) =>
          col.distance < closest.distance ? col : closest
        )
      : null;
  };

  const handleProfileClick = async () => {
    if (isAnimating || isPhysicsMode) return;

    if (nextEffect === 'pop') {
      setIsAnimating(true);
      setFadeInOriginal(false);
      playBubblePopSound();

      setTimeout(() => {
        setFadeInOriginal(true);
        setTimeout(() => {
          setIsAnimating(false);
          setFadeInOriginal(false);
          setNextEffect('physics');
        }, 1000);
      }, 5000);
    } else {
      // --- ADDED: Accelerometer permission logic from original ---
      if (usesAccelerometer && typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        try {
          const permissionState = await (DeviceOrientationEvent as any).requestPermission();
          if (permissionState !== 'granted') {
            console.log('Device orientation permission denied');
            return;
          }
        } catch (error) {
          console.error('Error requesting device orientation permission:', error);
          return;
        }
      }

      if (clickableIconRef.current) {
        const rect = clickableIconRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        originalPosition.current = { x: centerX, y: centerY };

        const initialState = {
          x: centerX,
          y: centerY,
          vx: 0,
          vy: 0,
          rotation: 0,
          rotationVelocity: 0,
        };

        setPhysics(initialState);
        currentPhysics.current = initialState; // Set ref immediately
        setIsPhysicsMode(true);
      }
    }
  };

  // --- Drag Handlers (Restored from Original) ---
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isPhysicsMode || usesAccelerometer) return;
    e.preventDefault();
    setIsDragging(true);
    lastMousePos.current = { x: e.clientX, y: e.clientY, time: Date.now() };
    dragStartPos.current = { x: e.clientX - physics.x, y: e.clientY - physics.y };
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isPhysicsMode || usesAccelerometer) return;
    e.preventDefault();
    setIsDragging(true);
    const touch = e.touches[0];
    lastMousePos.current = { x: touch.clientX, y: touch.clientY, time: Date.now() };
    dragStartPos.current = { x: touch.clientX - physics.x, y: touch.clientY - physics.y };
  };

  // --- Physics Effects ---

  // --- ADDED: All missing useEffects from original ---


  // Detect mobile and accelerometer
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth < 768;
      if (isMobileDevice && typeof DeviceOrientationEvent !== 'undefined') {
        setUsesAccelerometer(true);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize audio context
  useEffect(() => {
    if (typeof window !== "undefined" && !audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }, []);

  // Accelerometer physics
  useEffect(() => {
    if (!usesAccelerometer || !isPhysicsMode) return;

    const handleOrientation = (event: DeviceOrientationEvent) => {
      const beta = event.beta || 0;
      const gamma = event.gamma || 0;
      const gravityX = (gamma / 90) * 4.0;
      const gravityY = (beta / 90) * 4.0;

      // Use setPhysics to apply continuous force
      setPhysics((prev) => ({
        ...prev,
        vx: prev.vx + gravityX * 1.5,
        vy: prev.vy + gravityY * 1.5,
      }));
    };

    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      window.addEventListener('deviceorientation', handleOrientation);
    } else {
      window.addEventListener('deviceorientation', handleOrientation);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [usesAccelerometer, isPhysicsMode]);

  // Sync position on physics start
  useLayoutEffect(() => {
    if (isPhysicsMode && physicsIconRef.current) {
      // This logic runs *after* the icon is rendered but *before* paint
      // to get its initial position.
      const rect = physicsIconRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Only update if position is stale (e.g., from a resize)
      if (Math.abs(physics.x - centerX) > 5 || Math.abs(physics.y - centerY) > 5) {
        const correctedState = { ...physics, x: centerX, y: centerY };
        setPhysics(correctedState);
        currentPhysics.current = correctedState;
      }
    }
  }, [isPhysicsMode]); // Only run when entering physics mode

  // Global drag listeners (Restored original velocity calculation)
  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const now = Date.now();

      const newX = clientX - dragStartPos.current.x;
      const newY = clientY - dragStartPos.current.y;

      velocityHistory.current.push({ x: clientX, y: clientY, time: now });
      if (velocityHistory.current.length > VELOCITY_HISTORY_LENGTH) {
        velocityHistory.current.shift();
      }

      setPhysics((prev) => ({ ...prev, x: newX, y: newY }));

      const distanceToSnap = Math.sqrt(
        Math.pow(newX - originalPosition.current.x, 2) +
        Math.pow(newY - originalPosition.current.y, 2)
      );
      setIsNearSnapZone(distanceToSnap < SNAP_DISTANCE);
    };

    const handleEnd = () => {
      if (!isDragging) return;

      const distanceToSnap = Math.sqrt(
        Math.pow(currentPhysics.current.x - originalPosition.current.x, 2) +
        Math.pow(currentPhysics.current.y - originalPosition.current.y, 2)
      );

      if (distanceToSnap < SNAP_DISTANCE) {
        setIsPhysicsMode(false);
        setIsDragging(false);
        setIsNearSnapZone(false);
        velocityHistory.current = [];
        setNextEffect('pop');
        return;
      }
      
      // --- RESTORED: Original, smoother velocity calculation ---
      let vx = 0;
      let vy = 0;
      if (velocityHistory.current.length >= 2) {
        const recent = velocityHistory.current.slice(-3); // Last 3 points
        let totalVx = 0;
        let totalVy = 0;
        let count = 0;

        for (let i = 1; i < recent.length; i++) {
          const timeDiff = recent[i].time - recent[i - 1].time;
          if (timeDiff > 0 && timeDiff < 100) {
            const dx = recent[i].x - recent[i - 1].x;
            const dy = recent[i].y - recent[i - 1].y;
            totalVx += dx / timeDiff;
            totalVy += dy / timeDiff;
            count++;
          }
        }

        if (count > 0) {
          vx = (totalVx / count) * 16;
          vy = (totalVy / count) * 16;
        }
      }
      // ---

      setPhysics((prev) => ({
        ...prev,
        vx,
        vy,
        rotationVelocity: vx * 0.2, // Original rotation velocity calc
      }));

      setIsDragging(false);
      velocityHistory.current = [];
    };

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleEnd);
    document.addEventListener("touchmove", handleMove, { passive: false });
    document.addEventListener("touchend", handleEnd);

    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleEnd);
      document.removeEventListener("touchmove", handleMove);
      document.removeEventListener("touchend", handleEnd);
    };
  }, [isDragging, SNAP_DISTANCE, VELOCITY_HISTORY_LENGTH]);


  // =================================================================
  // FIX 3: Replaced simulation loop with the original complex version
  // =================================================================
  useEffect(() => {
    // This effect syncs the ref *after* React has updated the state
    currentPhysics.current = physics;
  }, [physics]);

  useEffect(() => {
    if (!isPhysicsMode || isDragging) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = undefined;
      }
      return;
    }

    const simulate = () => {
      // Read from the ref, update object, then set state once
      let { x, y, vx, vy, rotation, rotationVelocity } = currentPhysics.current;

      const radius = ICON_SIZE / 2;
      let onGroundThisFrame = false;

      if (!usesAccelerometer) {
        vy += GRAVITY;
      }

      vx *= AIR_FRICTION;
      vy *= AIR_FRICTION;

      x += vx;
      y += vy;

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Left edge
      if (x - radius < 0) {
        x = radius;
        const impactVelocity = Math.abs(vx);
        vx = Math.abs(vx) * BOUNCE_DAMPING;
        if (impactVelocity > ROLLING_THRESHOLD) playCollisionSound(impactVelocity);
      }

      // Right edge
      if (x + radius > viewportWidth) {
        x = viewportWidth - radius;
        const impactVelocity = Math.abs(vx);
        vx = -Math.abs(vx) * BOUNCE_DAMPING;
        if (impactVelocity > ROLLING_THRESHOLD) playCollisionSound(impactVelocity);
      }

      // Top edge
      if (y - radius < 0) {
        y = radius;
        const impactVelocity = Math.abs(vy);
        vy = Math.abs(vy) * BOUNCE_DAMPING;
        if (impactVelocity > ROLLING_THRESHOLD) playCollisionSound(impactVelocity);
      }

      // Bottom edge (ground)
      if (y + radius > viewportHeight) {
        y = viewportHeight - radius;
        const impactVelocity = Math.abs(vy);
        vy = -Math.abs(vy) * BOUNCE_DAMPING;
        onGroundThisFrame = true;

        if (Math.abs(impactVelocity) > ROLLING_THRESHOLD) {
          playCollisionSound(impactVelocity);
        } else {
          vy = 0; // Stick to ground
        }
      }

      // Collision with page elements
      if (!usesAccelerometer) {
        const collision = checkPixelCollision(x, y, radius);
        if (collision) {
          const rect = collision.element.getBoundingClientRect();
          let impactVelocity = 0;

          if (collision.side === "left") {
            x = rect.left - radius - 1;
            impactVelocity = Math.abs(vx);
            vx = -Math.abs(vx) * BOUNCE_DAMPING;
          } else if (collision.side === "right") {
            x = rect.right + radius + 1;
            impactVelocity = Math.abs(vx);
            vx = Math.abs(vx) * BOUNCE_DAMPING;
          } else if (collision.side === "top") {
            y = rect.top - radius - 1;
            impactVelocity = Math.abs(vy);
            vy = -Math.abs(vy) * BOUNCE_DAMPING;
            onGroundThisFrame = true; // Now on top of an element
          } else if (collision.side === "bottom") {
            y = rect.bottom + radius + 1;
            impactVelocity = Math.abs(vy);
            vy = Math.abs(vy) * BOUNCE_DAMPING;
          }

          if (impactVelocity > ROLLING_THRESHOLD) {
              playCollisionSound(impactVelocity);
          } else if (onGroundThisFrame) {
              vy = 0; // Stick to surface
          }
        }
      }

      // Rolling physics
      if (onGroundThisFrame) {
        vx *= ROLLING_FRICTION;
        const targetRotationVelocity = (vx / radius) * 57.2958; // rad to deg
        rotationVelocity = rotationVelocity * 0.7 + targetRotationVelocity * 0.3;
      } else {
        rotationVelocity *= 0.99; // Angular friction in air
      }

      rotation += rotationVelocity;
      isOnGround.current = onGroundThisFrame;
      
      const newState = { x, y, vx, vy, rotation, rotationVelocity };
      currentPhysics.current = newState; // Update ref immediately for next frame
      setPhysics(newState); // Update state to trigger re-render

      animationFrameRef.current = requestAnimationFrame(simulate);
    };

    animationFrameRef.current = requestAnimationFrame(simulate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = undefined;
      }
    };
  }, [isPhysicsMode, isDragging, usesAccelerometer]); // Restored original dependencies

  return (
    <div className="m-0 max-w-[1280px] w-full py-8 px-6 pb-16 md:p-16 md:pl-20 text-primary">
      <LondonWidget />
      <audio ref={audioRef} src="/sounds/bubble-pop.mp3" preload="auto" />
      <div className="mb-12 flex flex-col items-center text-center gap-6 md:flex-row md:items-start md:text-left md:gap-8">
        <div className="relative flex-shrink-0" style={{ width: '130px', height: '130px', marginLeft: '-5px', marginTop: '-5px' }}>
          <img
            ref={placeholderRef}
            src="/images/face.jpg"
            alt="Face"
            style={{
              position: 'absolute',
              top: '5px',
              left: '5px',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              objectFit: 'cover',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              zIndex: 0
            }}
          />
          {isPhysicsMode && isNearSnapZone && (
            <div style={{
              position: 'absolute',
              top: '5px',
              left: '5px',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              border: '2px solid rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.2)',
              zIndex: 1,
              animation: 'pulse 1s ease-in-out infinite'
            }} />
          )}
          {!isPhysicsMode && (
            <img
              ref={clickableIconRef}
              src="/images/favicon.png"
              alt="Dan Danaher profile"
              className={`${isAnimating ? 'animate-bubble-pop' : ''} ${fadeInOriginal ? 'animate-profile-fade-in' : ''}`}
              onClick={handleProfileClick}
              style={{
                position: 'absolute',
                cursor: 'pointer',
                top: '0',
                left: '0',
                width: '130px',
                height: '130px',
                borderRadius: '50%',
                objectFit: 'cover',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                transition: 'opacity 1s ease-in-out',
                zIndex: 2
              }}
            />
          )}
        </div>
        <div className="flex flex-col gap-3 items-center md:items-start">
          <h1 className="font-serif text-4xl md:text-5xl font-normal leading-tight text-primary">dan danaher</h1>
          <div className="flex gap-3 justify-center md:justify-start">
            <a
              href="https://github.com/dandanaher"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-secondary bg-transparent text-primary hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-background"
              style={{ transition: 'transform 0.2s ease' }}
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
              className="flex h-10 w-10 items-center justify-center rounded-full border border-secondary bg-transparent text-primary hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-background"
              style={{ transition: 'transform 0.2s ease' }}
              aria-label="X/Twitter"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Bio Content */}
      <div className="mb-6 max-w-2xl md:ml-[162px]">
        <h2 className="mb-2 text-xl md:text-2xl font-serif text-primary">who am i?</h2>
        <p className="text-sm md:text-base text-secondary leading-relaxed">
          my name is dan danaher, i'm a 21 year old aerospace engineering student studying at a russel group university in London. i love experimenting with web dev, reading and drawing in my spare time, but my real passion lies with spaceflight. i've been passively interested in spaceflight for my entire life, but my enthrallment started in 2018 with the first falcon heavy flight test. my mission, since then, has been to expand the scope of my knowledge and expertise in spaceflight without limit. i've been an active contributor to multiple online spaceflight-centric projects, including social media for <a href="https://www.youtube.com/@LabPadre" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }} onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-accent)'; e.currentTarget.style.textDecoration = 'underline'; }} onMouseLeave={(e) => { e.currentTarget.style.color = 'inherit'; e.currentTarget.style.textDecoration = 'none'; }}>LabPadre</a>, graphics for <a href="https://www.youtube.com/@RGVAerialPhotography" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }} onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-accent)'; e.currentTarget.style.textDecoration = 'underline'; }} onMouseLeave={(e) => { e.currentTarget.style.color = 'inherit'; e.currentTarget.style.textDecoration = 'none'; }}>RGV aerial photography</a>, and more.
        </p>
      </div>

      <div className="mb-6 max-w-2xl md:ml-[162px]">
        <h2 className="mb-2 text-xl md:text-2xl font-serif text-primary">my experience</h2>
        <p className="text-sm md:text-base text-secondary leading-relaxed">
          beyond official studies, i'm continuously learning and adding to my skillset with online resources and personal projects. web development is one of those, and i thought this site would be a good place to consolidate my output and share some of what i do.
        </p>
      </div>

      {/* Physics Icon */}
      {isPhysicsMode && (
        <div
          ref={physicsIconRef}
          style={{
            position: 'fixed',
            zIndex: 101,
            left: physics.x - ICON_SIZE / 2,
            top: physics.y - ICON_SIZE / 2,
            width: ICON_SIZE,
            height: ICON_SIZE,
            transform: `rotate(${physics.rotation}deg)`,
            touchAction: 'none',
            cursor: usesAccelerometer ? 'default' : (isDragging ? 'grabbing' : 'grab'),
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <div style={{
            position: 'relative',
            height: '100%',
            width: '100%',
            borderRadius: '50%',
            overflow: 'hidden',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
            backgroundColor: 'var(--color-surface)',
          }}>
            <img
              src="/images/favicon.png"
              alt="Dan profile"
              style={{ height: '100%', width: '100%', objectFit: 'cover' }}
              draggable={false}
            />
          </div>
        </div>
      )}

      {/* Container for physics simulation */}
      {isPhysicsMode && (
        <div
          ref={containerRef}
          style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 100 }}
        />
      )}
    </div>
  );
};

