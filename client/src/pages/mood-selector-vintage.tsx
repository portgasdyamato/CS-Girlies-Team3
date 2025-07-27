
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import axios from 'axios';

interface Mood {
  emoji: string;
  label: string;
}

const moods: Mood[] = [
  { emoji: '🌞', label: 'Radiant' },
  { emoji: '🌧️', label: 'Heavy' },
  { emoji: '🌸', label: 'Grateful' },
  { emoji: '🔥', label: 'Motivated' },
  { emoji: '🌙', label: 'Dreamy' },
  { emoji: '🫧', label: 'Anxious' },
  { emoji: '🪩', label: 'Excited' },
  { emoji: '🕊️', label: 'Calm' },
];

export default function MoodSelectorVintage() {
  const [selected, setSelected] = useState<Mood | null>(null);
  const [animating, setAnimating] = useState(false);
  const [, setLocation] = useLocation();

  const handleSelect = async (mood: Mood) => {
    setSelected(mood);
    setAnimating(true);
    await axios.post('/api/save-mood', { mood: mood.label, emoji: mood.emoji });
    setTimeout(() => {
      setLocation('/diary-cover');
    }, 600);
  };

  return (
    <motion.div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pastel-lavender via-pastel-peach to-pastel-mint eb-garamond-uniquifier relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none z-0" style={{background: 'repeating-linear-gradient(0deg,rgba(255,255,255,0.04),rgba(255,255,255,0.04) 1px,transparent 1px,transparent 80px),repeating-linear-gradient(90deg,rgba(255,255,255,0.04),rgba(255,255,255,0.04) 1px,transparent 1px,transparent 80px)'}} />
      <motion.h1 className="text-4xl sm:text-5xl font-bold mb-8 text-center eb-garamond-uniquifier z-10" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
        What’s your vibe today?
      </motion.h1>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 z-10">
        {moods.map((mood) => (
          <motion.button
            key={mood.label}
            className={`flex flex-col items-center justify-center rounded-full bg-white/30 shadow-lg p-6 text-3xl eb-garamond-uniquifier transition-all duration-300 border-2 border-white/40 ${selected?.label === mood.label ? 'ring-4 ring-pastel-pink scale-105' : 'hover:scale-105'}`}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelect(mood)}
            disabled={animating}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <span className="text-3xl mb-2">{mood.emoji}</span>
            <span className="text-base font-semibold mt-1">{mood.label}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
