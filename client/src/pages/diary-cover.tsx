import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';

export default function DiaryCover() {
  const [, setLocation] = useLocation();
  const [flipped, setFlipped] = useState(false);
  const [back, setBack] = useState(false);
  const [style, setStyle] = useState('vintage');
  const [mood, setMood] = useState(null);

  useEffect(() => {
    setStyle(localStorage.getItem('diaryStyle') || 'vintage');
    const moodObj = localStorage.getItem('diaryMood');
    setMood(moodObj ? JSON.parse(moodObj) : null);
  }, []);

  const handleFlip = () => {
    setFlipped(true);
    setTimeout(() => setLocation('/journal-entry'), 700);
  };
  const handleBack = () => {
    setBack(true);
    setTimeout(() => setLocation('/mood-selector'), 700);
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center eb-garamond-uniquifier relative ${style === 'cute' ? 'bg-gradient-to-br from-pink-200 via-pink-100 to-yellow-100' : 'bg-gradient-to-br from-pastel-lavender via-pastel-peach to-pastel-mint'}`}>
      {/* Starry/cute background */}
      <div className="absolute inset-0 pointer-events-none z-0" style={style === 'cute' ? {background: 'radial-gradient(ellipse at 50% 40%, #ffe0f7 0%, #ffd6e0 60%, #fff5e1 100%)', opacity: 0.5} : {background: 'radial-gradient(ellipse at 50% 40%, #2d1850 0%, #4b2e7a 60%, #a78bfa 100%)', opacity: 0.3}} />
      <div className="flex flex-col items-center z-10">
        <AnimatePresence mode="wait">
          {!flipped && !back && (
            <motion.div
              key="cover"
              className={`relative glass-card p-12 rounded-3xl shadow-2xl flex flex-col items-center ${style === 'cute' ? 'bg-white/80 border-4 border-pink-200' : ''}`}
              style={style === 'cute' ? { perspective: 1200, background: 'url(/cute-diary-bg.png), #fff5f8', backgroundSize: 'cover' } : { perspective: 1200, background: 'url(/vintage-leather.jpg), #f8f4e3', backgroundSize: 'cover' }}
              initial={{ rotateY: 0, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: -100, opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.77, 0, 0.175, 1] }}
              aria-label={style === 'cute' ? 'Cute Diary Cover' : 'Vintage Diary Cover'}
            >
              {/* Book spine or cute bow */}
              {style === 'vintage' ? (
                <div className="absolute left-0 top-0 h-full w-6 bg-gradient-to-b from-[#bfa77a] to-[#8c6e3f] rounded-l-3xl shadow-lg" style={{ zIndex: 2 }} />
              ) : (
                <div className="absolute left-0 top-0 h-full w-8 flex items-center justify-center" style={{ zIndex: 2 }}>
                  <span className="text-pink-400 text-4xl">🎀</span>
                </div>
              )}
              <h1 className={`text-5xl font-bold mb-8 z-10 ${style === 'cute' ? 'text-pink-400 drop-shadow' : ''}`}>{style === 'cute' ? 'My Cute Diary' : 'My Vintage Diary'}</h1>
              {mood && <div className="mb-4 text-2xl">{mood.emoji} <span className="text-lg">{mood.label}</span></div>}
              <button className="btn-purple px-8 py-4 text-xl rounded-xl mt-8 z-10" onClick={handleFlip} aria-label="Write Journal">Write Journal</button>
              <button className="btn-purple px-6 py-2 rounded-lg mt-4 z-10" onClick={handleBack} aria-label="Back to Mood Selector">Back to Mood Selector</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 