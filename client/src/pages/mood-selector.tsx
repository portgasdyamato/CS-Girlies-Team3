import React, { useState } from 'react';
import { useLocation } from 'wouter';

const moods = [
  { emoji: '🌞', label: 'Radiant' },
  { emoji: '🌧️', label: 'Heavy' },
  { emoji: '🌸', label: 'Grateful' },
  { emoji: '🔥', label: 'Motivated' },
  { emoji: '🌙', label: 'Dreamy' },
  { emoji: '🫧', label: 'Anxious' },
  { emoji: '🪩', label: 'Excited' },
  { emoji: '🕊️', label: 'Calm' },
];

const styles = [
  { key: 'vintage', label: 'Vintage', icon: '📖' },
  { key: 'cute', label: 'Cute', icon: '🧸' },
];

export default function MoodSelector() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState('vintage');
  const [, setLocation] = useLocation();

  const handleContinue = () => {
    if (!selectedMood) return;
    localStorage.setItem('diaryMood', JSON.stringify(selectedMood));
    localStorage.setItem('diaryStyle', selectedStyle);
    setLocation('/diary-cover');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pastel-lavender via-pastel-peach to-pastel-mint eb-garamond-uniquifier relative overflow-hidden">
      <h1 className="text-4xl sm:text-5xl font-bold mb-8 text-center eb-garamond-uniquifier z-10">What's your vibe and style today?</h1>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10 z-10">
        {moods.map((mood) => (
          <button
            key={mood.label}
            className={`flex flex-col items-center justify-center rounded-full bg-white/30 shadow-lg p-6 text-3xl eb-garamond-uniquifier transition-all duration-300 border-2 border-white/40 ${selectedMood?.label === mood.label ? 'ring-4 ring-pastel-pink scale-105' : 'hover:scale-105'}`}
            onClick={() => setSelectedMood(mood)}
          >
            <span className="text-3xl mb-2">{mood.emoji}</span>
            <span className="text-base font-semibold mt-1">{mood.label}</span>
          </button>
        ))}
      </div>
      <div className="flex gap-8 mb-10 z-10">
        {styles.map((style) => (
          <button
            key={style.key}
            className={`flex flex-col items-center justify-center rounded-xl px-8 py-4 text-2xl font-bold border-2 ${selectedStyle === style.key ? 'bg-pastel-pink text-white border-pastel-pink' : 'bg-white/30 border-white/40 text-pastel-pink'} transition-all`}
            onClick={() => setSelectedStyle(style.key)}
          >
            <span className="mb-1">{style.icon}</span>
            {style.label}
          </button>
        ))}
      </div>
      <button
        className="btn-purple px-8 py-4 text-xl rounded-xl mt-4 z-10"
        onClick={handleContinue}
        disabled={!selectedMood}
      >
        Continue
      </button>
    </div>
  );
}