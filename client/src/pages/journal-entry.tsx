import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import axios from 'axios';

// Same mood themes as diary cover for consistency
const moodThemes = {
  happy: {
    background: 'linear-gradient(135deg, #fff9c4 0%, #ffe082 50%, #ffcc02 100%)',
    pageColor: '#fffef7',
    decoration: '☀️',
    textColor: '#e65100',
    accentColor: '#f9a825',
    pattern: 'radial-gradient(circle at 20% 30%, rgba(255,193,7,0.1) 0%, transparent 50%)'
  },
  sad: {
    background: 'linear-gradient(135deg, #e3f2fd 0%, #90caf9 50%, #42a5f5 100%)',
    pageColor: '#f8fcff',
    decoration: '🌧️',
    textColor: '#0d47a1',
    accentColor: '#1976d2',
    pattern: 'radial-gradient(circle at 70% 20%, rgba(33,150,243,0.1) 0%, transparent 50%)'
  },
  excited: {
    background: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd0 50%, #e91e63 100%)',
    pageColor: '#fffafc',
    decoration: '🎉',
    textColor: '#880e4f',
    accentColor: '#c2185b',
    pattern: 'radial-gradient(circle at 40% 60%, rgba(233,30,99,0.1) 0%, transparent 50%)'
  },
  calm: {
    background: 'linear-gradient(135deg, #e8f5e9 0%, #a5d6a7 50%, #66bb6a 100%)',
    pageColor: '#f9fdf9',
    decoration: '🍃',
    textColor: '#1b5e20',
    accentColor: '#388e3c',
    pattern: 'radial-gradient(circle at 60% 40%, rgba(76,175,80,0.1) 0%, transparent 50%)'
  },
  angry: {
    background: 'linear-gradient(135deg, #ffe0b2 0%, #ffcc80 50%, #ff9800 100%)',
    pageColor: '#fffcf7',
    decoration: '🔥',
    textColor: '#bf360c',
    accentColor: '#f57c00',
    pattern: 'radial-gradient(circle at 30% 70%, rgba(255,152,0,0.1) 0%, transparent 50%)'
  },
  romantic: {
    background: 'linear-gradient(135deg, #ede7f6 0%, #b39ddb 50%, #9c27b0 100%)',
    pageColor: '#fdfcff',
    decoration: '💕',
    textColor: '#4a148c',
    accentColor: '#7b1fa2',
    pattern: 'radial-gradient(circle at 50% 30%, rgba(156,39,176,0.1) 0%, transparent 50%)'
  },
  nostalgic: {
    background: 'linear-gradient(135deg, #f9fbe7 0%, #dcedc8 50%, #8bc34a 100%)',
    pageColor: '#fdfff9',
    decoration: '🌸',
    textColor: '#33691e',
    accentColor: '#689f38',
    pattern: 'radial-gradient(circle at 80% 20%, rgba(139,195,74,0.1) 0%, transparent 50%)'
  },
  dreamy: {
    background: 'linear-gradient(135deg, #efebe9 0%, #d7ccc8 50%, #8d6e63 100%)',
    pageColor: '#fdfcfb',
    decoration: '✨',
    textColor: '#3e2723',
    accentColor: '#5d4037',
    pattern: 'radial-gradient(circle at 25% 75%, rgba(141,110,99,0.1) 0%, transparent 50%)'
  }
};

export default function JournalEntry() {
  const [entry, setEntry] = useState('');
  const [, setLocation] = useLocation();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [flipping, setFlipping] = useState(false);
  const [selectedMood, setSelectedMood] = useState('happy');
  const [isPageOpen, setIsPageOpen] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [currentDate, setCurrentDate] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Get mood from localStorage
    const storedMood = localStorage.getItem('selectedMood');
    if (storedMood && moodThemes[storedMood as keyof typeof moodThemes]) {
      setSelectedMood(storedMood);
    }

    // Set current date
    const now = new Date();
    setCurrentDate(now.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }));

    // Animate page opening
    setTimeout(() => setIsPageOpen(true), 300);
  }, []);

  useEffect(() => {
    // Update word count
    const words = entry.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [entry]);

  const currentTheme = moodThemes[selectedMood as keyof typeof moodThemes];

  const handleSave = async () => {
    if (!entry.trim()) return;
    
    setSaving(true);
    setError('');
    try {
      await axios.post('/api/save-entry', { 
        entry, 
        timestamp: new Date().toISOString(),
        mood: selectedMood,
        wordCount 
      });
      
      // Show success animation
      if (textareaRef.current) {
        textareaRef.current.style.background = 'rgba(76, 175, 80, 0.1)';
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.style.background = 'transparent';
          }
        }, 1000);
      }
      
      setEntry('');
      setWordCount(0);
    } catch (e) {
      setError('Failed to save entry. Please try again.');
    }
    setSaving(false);
  };

  const handleBack = () => {
    setFlipping(true);
    setTimeout(() => setLocation('/diary-cover'), 1000);
  };

  const handleAutoResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
    setEntry(textarea.value);
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center eb-garamond-uniquifier relative overflow-hidden"
      style={{ background: currentTheme.background }}
    >
      {/* Background pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{ background: currentTheme.pattern }}
      />

      {/* Floating mood particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-xl opacity-20"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -15, 0],
              opacity: [0.1, 0.3, 0.1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            {currentTheme.decoration}
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col items-center w-full max-w-4xl z-10 px-4">
        <AnimatePresence mode="wait">
          {!flipping && (
            <motion.div
              key="journal-book"
              className="relative w-full max-w-4xl"
              initial={{ rotateY: 180, opacity: 0, scale: 0.8 }}
              animate={{ 
                rotateY: isPageOpen ? 0 : 180, 
                opacity: 1, 
                scale: 1 
              }}
              exit={{ 
                rotateY: -180, 
                opacity: 0,
                scale: 0.8,
                transition: { duration: 1, ease: [0.77, 0, 0.175, 1] }
              }}
              transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1] }}
              style={{ perspective: 1200 }}
            >
              {/* Book Pages Container */}
              <div className="relative flex shadow-2xl rounded-2xl overflow-hidden">
                {/* Left Page (Binding) */}
                <motion.div
                  className="w-1/2 p-8 flex flex-col"
                  style={{ 
                    background: `linear-gradient(to right, ${currentTheme.pageColor}, rgba(0,0,0,0.05))`,
                    borderRight: '2px solid rgba(0,0,0,0.1)'
                  }}
                  initial={{ x: -20, opacity: 0.8 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  {/* Date Header */}
                  <motion.div
                    className="text-center mb-8"
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                  >
                    <div 
                      className="text-2xl font-bold mb-2"
                      style={{ color: currentTheme.textColor }}
                    >
                      {currentTheme.decoration} Dear Diary {currentTheme.decoration}
                    </div>
                    <div 
                      className="text-lg opacity-70"
                      style={{ color: currentTheme.textColor }}
                    >
                      {currentDate}
                    </div>
                    <div className="mt-4 h-px bg-current opacity-20"></div>
                  </motion.div>

                  {/* Mood Indicator */}
                  <motion.div
                    className="text-center mb-6"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1, duration: 0.5, type: "spring" }}
                  >
                    <div className="text-4xl mb-2">{currentTheme.decoration}</div>
                    <div 
                      className="text-sm font-medium uppercase tracking-wider"
                      style={{ color: currentTheme.accentColor }}
                    >
                      Mood: {selectedMood}
                    </div>
                  </motion.div>

                  {/* Decorative Elements */}
                  <div className="flex-1 flex flex-col justify-center items-center space-y-6">
                    <motion.div
                      className="text-6xl opacity-10"
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 6, repeat: Infinity }}
                    >
                      {currentTheme.decoration}
                    </motion.div>
                    
                    {/* Stats */}
                    <div className="text-center space-y-2">
                      <div 
                        className="text-sm font-medium"
                        style={{ color: currentTheme.textColor }}
                      >
                        Words: {wordCount}
                      </div>
                      <div 
                        className="text-xs opacity-60"
                        style={{ color: currentTheme.textColor }}
                      >
                        Keep writing...
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Right Page (Writing Area) */}
                <motion.div
                  className="w-1/2 p-8 flex flex-col"
                  style={{ background: currentTheme.pageColor }}
                  initial={{ x: 20, opacity: 0.8 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  {/* Page Lines Background */}
                  <div 
                    className="absolute inset-0 pointer-events-none opacity-10"
                    style={{
                      backgroundImage: `repeating-linear-gradient(
                        transparent,
                        transparent 31px,
                        ${currentTheme.accentColor} 32px
                      )`,
                      marginTop: '120px'
                    }}
                  />

                  {/* Writing Area */}
                  <motion.div
                    className="flex-1 relative z-10"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.6 }}
                  >
                    <textarea
                      ref={textareaRef}
                      className="w-full h-full resize-none border-none outline-none bg-transparent text-lg leading-8 font-serif"
                      style={{ 
                        color: currentTheme.textColor,
                        minHeight: '400px',
                        fontFamily: '"EB Garamond", serif'
                      }}
                      placeholder="What's on your mind today?"
                      value={entry}
                      onChange={handleAutoResize}
                      autoFocus
                      aria-label="Journal entry textarea"
                    />
                  </motion.div>

                  {/* Action Buttons */}
                  <motion.div
                    className="flex flex-col space-y-3 mt-6"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.4, duration: 0.6 }}
                  >
                    {error && (
                      <motion.div 
                        className="text-red-500 text-sm text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        {error}
                      </motion.div>
                    )}

                    <div className="flex space-x-3">
                      <motion.button
                        className="flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-300 text-white"
                        style={{ 
                          background: `linear-gradient(135deg, ${currentTheme.accentColor}, ${currentTheme.textColor})`,
                          boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                        }}
                        onClick={handleSave}
                        disabled={saving || !entry.trim()}
                        whileHover={{ 
                          scale: 1.02, 
                          boxShadow: '0 6px 20px rgba(0,0,0,0.3)' 
                        }}
                        whileTap={{ scale: 0.98 }}
                        aria-label="Save Entry"
                      >
                        {saving ? '💾 Saving...' : '💾 Save Entry'}
                      </motion.button>

                      <motion.button
                        className="px-6 py-3 rounded-lg font-medium transition-all duration-300"
                        style={{ 
                          background: 'rgba(0,0,0,0.05)',
                          color: currentTheme.textColor,
                          border: `2px solid ${currentTheme.accentColor}`
                        }}
                        onClick={() => setLocation('/past-entries')}
                        whileHover={{ 
                          scale: 1.02,
                          background: 'rgba(0,0,0,0.1)'
                        }}
                        whileTap={{ scale: 0.98 }}
                        aria-label="View Past Entries"
                      >
                        📖 Past Entries
                      </motion.button>
                    </div>

                    <motion.button
                      className="px-6 py-2 rounded-lg font-medium transition-all duration-300"
                      style={{ 
                        background: 'rgba(0,0,0,0.03)',
                        color: currentTheme.textColor,
                        border: `1px solid rgba(0,0,0,0.1)`
                      }}
                      onClick={handleBack}
                      whileHover={{ 
                        scale: 1.02,
                        background: 'rgba(0,0,0,0.08)'
                      }}
                      whileTap={{ scale: 0.98 }}
                      aria-label="Back to Diary Cover"
                    >
                      ← Back to Cover
                    </motion.button>
                  </motion.div>
                </motion.div>
              </div>

              {/* Book Binding Shadow */}
              <div 
                className="absolute left-1/2 top-0 h-full w-2 transform -translate-x-1/2 z-10"
                style={{
                  background: 'linear-gradient(to right, rgba(0,0,0,0.1), rgba(0,0,0,0.2), rgba(0,0,0,0.1))',
                  boxShadow: 'inset 0 0 10px rgba(0,0,0,0.3)'
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
