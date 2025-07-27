import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';

// Mood-based diary cover themes
const moodThemes = {
  happy: {
    background: 'linear-gradient(135deg, #fff9c4 0%, #ffe082 50%, #ffcc02 100%)',
    coverColor: '#f9a825',
    title: 'My Sunshine Diary',
    decoration: '☀️',
    pattern: 'radial-gradient(circle at 20% 30%, rgba(255,193,7,0.3) 0%, transparent 50%)',
    spine: 'linear-gradient(to bottom, #f57f17, #ff8f00)',
    textColor: '#e65100'
  },
  sad: {
    background: 'linear-gradient(135deg, #e3f2fd 0%, #90caf9 50%, #42a5f5 100%)',
    coverColor: '#1976d2',
    title: 'My Rainy Day Diary',
    decoration: '🌧️',
    pattern: 'radial-gradient(circle at 70% 20%, rgba(33,150,243,0.3) 0%, transparent 50%)',
    spine: 'linear-gradient(to bottom, #0d47a1, #1565c0)',
    textColor: '#0d47a1'
  },
  excited: {
    background: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd0 50%, #e91e63 100%)',
    coverColor: '#c2185b',
    title: 'My Adventure Diary',
    decoration: '🎉',
    pattern: 'radial-gradient(circle at 40% 60%, rgba(233,30,99,0.3) 0%, transparent 50%)',
    spine: 'linear-gradient(to bottom, #ad1457, #c2185b)',
    textColor: '#880e4f'
  },
  calm: {
    background: 'linear-gradient(135deg, #e8f5e9 0%, #a5d6a7 50%, #66bb6a 100%)',
    coverColor: '#388e3c',
    title: 'My Peaceful Diary',
    decoration: '🍃',
    pattern: 'radial-gradient(circle at 60% 40%, rgba(76,175,80,0.3) 0%, transparent 50%)',
    spine: 'linear-gradient(to bottom, #1b5e20, #2e7d32)',
    textColor: '#1b5e20'
  },
  angry: {
    background: 'linear-gradient(135deg, #ffe0b2 0%, #ffcc80 50%, #ff9800 100%)',
    coverColor: '#f57c00',
    title: 'My Fire Diary',
    decoration: '🔥',
    pattern: 'radial-gradient(circle at 30% 70%, rgba(255,152,0,0.3) 0%, transparent 50%)',
    spine: 'linear-gradient(to bottom, #e65100, #f57c00)',
    textColor: '#bf360c'
  },
  romantic: {
    background: 'linear-gradient(135deg, #ede7f6 0%, #b39ddb 50%, #9c27b0 100%)',
    coverColor: '#7b1fa2',
    title: 'My Love Diary',
    decoration: '💕',
    pattern: 'radial-gradient(circle at 50% 30%, rgba(156,39,176,0.3) 0%, transparent 50%)',
    spine: 'linear-gradient(to bottom, #4a148c, #6a1b9a)',
    textColor: '#4a148c'
  },
  nostalgic: {
    background: 'linear-gradient(135deg, #f9fbe7 0%, #dcedc8 50%, #8bc34a 100%)',
    coverColor: '#689f38',
    title: 'My Memory Diary',
    decoration: '🌸',
    pattern: 'radial-gradient(circle at 80% 20%, rgba(139,195,74,0.3) 0%, transparent 50%)',
    spine: 'linear-gradient(to bottom, #33691e, #558b2f)',
    textColor: '#33691e'
  },
  dreamy: {
    background: 'linear-gradient(135deg, #efebe9 0%, #d7ccc8 50%, #8d6e63 100%)',
    coverColor: '#5d4037',
    title: 'My Dream Diary',
    decoration: '✨',
    pattern: 'radial-gradient(circle at 25% 75%, rgba(141,110,99,0.3) 0%, transparent 50%)',
    spine: 'linear-gradient(to bottom, #3e2723, #4e342e)',
    textColor: '#3e2723'
  }
};

export default function DiaryCover() {
  const [, setLocation] = useLocation();
  const [flipped, setFlipped] = useState(false);
  const [back, setBack] = useState(false);
  const [selectedMood, setSelectedMood] = useState('happy');
  const [isAnimating, setIsAnimating] = useState(false);

  // Always sync selectedMood with localStorage and update on mount and when localStorage changes
  useEffect(() => {
    const updateMood = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const moodFromUrl = urlParams.get('mood');
      const storedMood = localStorage.getItem('selectedMood');
      if (moodFromUrl && moodThemes[moodFromUrl as keyof typeof moodThemes]) {
        setSelectedMood(moodFromUrl);
      } else if (storedMood && moodThemes[storedMood as keyof typeof moodThemes]) {
        setSelectedMood(storedMood);
      } else {
        setSelectedMood('happy');
      }
    };
    updateMood();
    window.addEventListener('storage', updateMood);
    return () => window.removeEventListener('storage', updateMood);
  }, []);

  const currentTheme = moodThemes[selectedMood as keyof typeof moodThemes];

  const handleFlip = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setFlipped(true);
    
    // Store the selected mood for the journal entry (ensure latest mood is saved)
    localStorage.setItem('selectedMood', selectedMood);
    
    setTimeout(() => {
      setLocation('/journal-entry');
    }, 1200);
  };

  const handleBack = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setBack(true);
    setTimeout(() => setLocation('/mood-selector'), 700);
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center eb-garamond-uniquifier relative overflow-hidden"
      style={{ background: currentTheme.background }}
    >
      {/* Mood Selector Dropdown - always visible and above everything */}
      <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-2 bg-white/80 px-6 py-3 rounded-xl shadow-lg border-2"
        style={{
          borderColor: currentTheme.textColor,
          backdropFilter: 'blur(8px)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)'
        }}
      >
        <label htmlFor="mood-select" className="font-medium text-lg mr-2" style={{color: currentTheme.textColor}}>Choose Mood:</label>
        <select
          id="mood-select"
          value={selectedMood}
          onChange={e => {
            setSelectedMood(e.target.value);
            localStorage.setItem('selectedMood', e.target.value);
          }}
          className="px-4 py-2 rounded-lg border-2 font-semibold text-lg"
          style={{
            background: '#fff',
            color: currentTheme.textColor,
            borderColor: currentTheme.textColor,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}
        >
          {Object.entries(moodThemes).map(([mood, theme]) => (
            <option key={mood} value={mood}>
              {theme.decoration} {mood.charAt(0).toUpperCase() + mood.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Animated background pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{ background: currentTheme.pattern }}
      />

      {/* Floating particles based on mood */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.7, 0.3],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            {currentTheme.decoration}
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col items-center z-10">
        <AnimatePresence mode="wait">
          {!flipped && !back && (
            <motion.div
              key="cover"
              className="relative p-16 rounded-3xl shadow-2xl flex flex-col items-center"
              style={{ 
                perspective: 1200, 
                background: currentTheme.coverColor,
                boxShadow: `0 20px 60px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)`,
                border: `2px solid rgba(255,255,255,0.1)`
              }}
              initial={{ rotateY: 0, opacity: 0, scale: 0.8 }}
              animate={{ rotateY: 0, opacity: 1, scale: 1 }}
              exit={{ 
                rotateY: flipped ? -180 : 180, 
                opacity: 0,
                scale: 0.8,
                transition: { duration: 1.2, ease: [0.77, 0, 0.175, 1] }
              }}
              transition={{ duration: 0.8, ease: [0.77, 0, 0.175, 1] }}
              aria-label="Mood-based Diary Cover"
            >
              {/* Book spine with enhanced 3D effect */}
              <div 
                className="absolute left-0 top-0 h-full w-8 rounded-l-3xl shadow-lg"
                style={{ 
                  background: currentTheme.spine,
                  boxShadow: 'inset -2px 0 4px rgba(0,0,0,0.3), -4px 0 8px rgba(0,0,0,0.2)',
                  zIndex: 2 
                }} 
              />
              
              {/* Decorative corner elements */}
              <div className="absolute top-4 left-4 text-3xl opacity-60">
                {currentTheme.decoration}
              </div>
              <div className="absolute top-4 right-4 text-3xl opacity-60">
                {currentTheme.decoration}
              </div>
              <div className="absolute bottom-4 left-4 text-3xl opacity-60">
                {currentTheme.decoration}
              </div>
              <div className="absolute bottom-4 right-4 text-3xl opacity-60">
                {currentTheme.decoration}
              </div>

              {/* Main content */}
              <motion.div
                className="text-center z-10"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <div className="text-6xl mb-6">{currentTheme.decoration}</div>
                <h1 
                  className="text-5xl font-bold mb-8 text-shadow-lg"
                  style={{ color: currentTheme.textColor, textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}
                >
                  {currentTheme.title}
                </h1>
                
                {/* Ornamental divider */}
                <div className="flex items-center justify-center mb-8">
                  <div className="h-px bg-current opacity-30 flex-1 max-w-16"></div>
                  <div className="mx-4 text-2xl opacity-60">{currentTheme.decoration}</div>
                  <div className="h-px bg-current opacity-30 flex-1 max-w-16"></div>
                </div>

                <motion.button 
                  className="px-10 py-4 text-xl rounded-xl font-semibold transition-all duration-300 mb-4 mr-4"
                  style={{ 
                    background: `linear-gradient(135deg, ${currentTheme.textColor}, ${currentTheme.coverColor})`,
                    color: 'white',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                  }}
                  onClick={handleFlip} 
                  disabled={isAnimating}
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: '0 6px 20px rgba(0,0,0,0.3)' 
                  }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Write Journal Entry"
                >
                  ✍️ Write Entry
                </motion.button>

                <motion.button 
                  className="px-8 py-3 text-lg rounded-lg font-medium transition-all duration-300"
                  style={{ 
                    background: 'rgba(255,255,255,0.2)',
                    color: currentTheme.textColor,
                    border: `2px solid ${currentTheme.textColor}`,
                    backdropFilter: 'blur(10px)'
                  }}
                  onClick={handleBack} 
                  disabled={isAnimating}
                  whileHover={{ 
                    scale: 1.05,
                    background: 'rgba(255,255,255,0.3)'
                  }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Back to Mood Selector"
                >
                  ← Change Mood
                </motion.button>
              </motion.div>

              {/* Subtle texture overlay */}
              <div 
                className="absolute inset-0 rounded-3xl opacity-10 pointer-events-none"
                style={{
                  background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='53' cy='53' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
