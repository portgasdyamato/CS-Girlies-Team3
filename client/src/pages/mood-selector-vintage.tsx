
import React, { useState } from "react";
// MuseMood Mood Selector Page
// Magical, dreamy, starry night UI
import { motion } from "framer-motion";
import axios from "axios";
import "../index.css";

// Starry background CSS and floatIn animation
const starBgStyles = `
  body {
    position: relative;
    min-height: 100vh;
    overflow: hidden;
  }
  .star-bg {
    position: fixed;
    top: 0; left: 0; width: 100vw; height: 100vh;
    z-index: 0;
    pointer-events: none;
    background: radial-gradient(ellipse at 50% 40%, #2d1850 0%, #4b2e7a 60%, #a78bfa 100%);
    animation: bgMove 18s linear infinite alternate;
  }
  @keyframes bgMove {
    0% { background-position: 0% 40%; }
    100% { background-position: 100% 60%; }
  }
  .star {
    position: absolute;
    border-radius: 50%;
    background: white;
    opacity: 0.8;
    animation: twinkle 2.5s infinite ease-in-out;
  }
  @keyframes twinkle {
    0%, 100% { opacity: 0.8; }
    50% { opacity: 0.3; }
  }
  .mood-icon {
    border-radius: 50%;
    background: rgba(255,255,255,0.08);
    padding: 10px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: box-shadow 0.3s, border 0.3s;
  }
  @keyframes floatIn {
    from { opacity: 0; transform: scale(0.8) translateY(20px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }
`;

const moods = [
  { emoji: "🌞", label: "Radiant" },
  { emoji: "🌧️", label: "Heavy" },
  { emoji: "🌸", label: "Grateful" },
  { emoji: "🔥", label: "Motivated" },
  { emoji: "🌙", label: "Dreamy" },
  { emoji: "🫧", label: "Anxious" },
  { emoji: "🪩", label: "Excited" },
  { emoji: "🕊️", label: "Calm" },
];

type Mood = {
  emoji: string;
  label: string;
};

interface MoodSelectorProps {
  onMoodSelected: (mood: Mood) => void;
}

export default function MoodSelector({ onMoodSelected }: MoodSelectorProps) {
  const [selected, setSelected] = useState<Mood | null>(null);
  const [animating, setAnimating] = useState(false);

  // Inject starry background CSS
  React.useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = starBgStyles;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  // Generate random stars for background
  const [stars] = useState(() => Array.from({ length: 60 }, () => ({
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 2.5,
  })));

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bitcount-grid-double-uniquifier overflow-hidden">
      {/* Starry animated background */}
      <div className="star-bg">
        {stars.map((star, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </div>
      {/* Header container with padding and text-shadow */}
      <div className="w-full flex flex-col items-center pt-10 pb-4 z-10" style={{paddingTop: '2.5rem'}}>
        <div style={{
          marginBottom: '0.5rem',
        }}>
          <h1
            className="text-5xl md:text-6xl bitcount-grid-double-uniquifier font-bold text-[#b993d6] tracking-tight text-center"
            style={{
              letterSpacing: '0.01em',
              
            }}
          >
            MuseMood
          </h1>
          <div
            className="text-2xl md:text-3xl bitcount-grid-double-uniquifier font-semibold mt-2 mb-1 text-center"
            style={{
              color: '#b993d6',
              
            }}
          >
            How are you feeling today?
          </div>
        </div>
      </div>
      {/* Mood selector bubble at center, with perfectly radial layout and responsive sizing */}
      <div
        className="flex items-center justify-center w-full z-10"
        style={{
          width: '100%',
          maxWidth: '480px',
          height: 'min(28rem, 70vw)',
          minHeight: '18rem',
          position: 'relative',
          marginBottom: '3.5rem',
        }}
      >
        {/* Animated big bubble */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle at 60% 40%, #fff4fa 0%, #b993d6 60%, #a78bfa 100%)',
            backdropFilter: 'blur(32px) saturate(120%)',
            zIndex: 1,
            boxShadow: '0 0 64px 0px #b993d6, 0 0 120px 0px #a78bfa',
            border: '2.5px solid rgba(185,147,214,0.18)',
            opacity: 0.98,
          }}
          initial={{ scale: 0.98, y: 0, boxShadow: '0 0 64px 0px #b993d6, 0 0 120px 0px #a78bfa' }}
          animate={{ scale: [0.98, 1.03, 0.98], y: [0, -10, 0], boxShadow: ['0 0 64px 0px #b993d6, 0 0 120px 0px #a78bfa', '0 0 80px 0px #b993d6, 0 0 160px 0px #a78bfa', '0 0 64px 0px #b993d6, 0 0 120px 0px #a78bfa'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Mood icons in radial/circular layout, emoji+label centered, responsive */}
        {moods.map((mood, i) => {
          // Responsive radius and icon size
          const containerSize = 448; // 28rem in px
          const iconSize = Math.min(window.innerWidth * 0.11, 70); // max 70px
          const radius = (containerSize / 2) - iconSize - 12;
          const angle = (i / moods.length) * 2 * Math.PI - Math.PI / 2;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          return (
            <div
              key={mood.label}
              style={{
                position: 'absolute',
                left: `calc(50% + ${x}px - ${iconSize/2}px)`,
                top: `calc(50% + ${y}px - ${iconSize/2}px)`,
                width: `${iconSize}px`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2,
                animation: `floatIn 0.7s ${0.2 + i * 0.12}s both`,
              }}
            >
            <motion.button
              className="mood-icon"
              style={{
                width: `${iconSize}px`,
                height: `${iconSize}px`,
                border: selected?.label === mood.label ? '2.5px solid #b993d6' : '2px solid #e5dcf2',
                boxShadow: selected?.label === mood.label
                  ? '0 8px 32px #b993d6, 0 0 0 8px #e5dcf2'
                  : '0 2px 8px rgba(0,0,0,0.2)',
                background: 'radial-gradient(circle at 60% 40%, #fff4fa 0%, #b993d6 80%, #a78bfa 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'box-shadow 0.3s, border 0.3s',
                opacity: 0.98,
              }}
              initial={{ scale: 0.97, y: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}
              animate={{ scale: [0.97, 1.07, 0.97], y: [0, -6, 0], boxShadow: selected?.label === mood.label
                ? ['0 8px 32px #b993d6, 0 0 0 8px #e5dcf2', '0 12px 40px #b993d6, 0 0 0 12px #e5dcf2', '0 8px 32px #b993d6, 0 0 0 8px #e5dcf2']
                : ['0 2px 8px rgba(0,0,0,0.2)', '0 6px 16px #b993d6', '0 2px 8px rgba(0,0,0,0.2)'] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              onClick={() => {
                setSelected(mood);
                setAnimating(true);
                setTimeout(() => {
                  onMoodSelected(mood);
                }, 700);
              }}
              disabled={animating}
            >
                <span
                  style={{
                    fontSize: `${iconSize * 0.45}px`,
                    filter: selected?.label === mood.label ? 'drop-shadow(0 0 8px #b993d6)' : 'none',
                    transition: 'filter 0.3s',
                  }}
                >
                  {mood.emoji}
                </span>
            </motion.button>
              <span
                className="mt-1 text-base md:text-lg bitcount-grid-double-uniquifier font-bold text-[#6d4ea7] tracking-wide drop-shadow-sm text-center"
                style={{
                  width: '100%',
                  fontSize: `${Math.max(iconSize * 0.22, 14)}px`,
                  pointerEvents: 'none',
                  animation: `floatIn 0.7s ${0.3 + i * 0.12}s both`,
                }}
              >
                {mood.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
