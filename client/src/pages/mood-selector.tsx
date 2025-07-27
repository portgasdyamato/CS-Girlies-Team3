
import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import "../index.css";

const moods = [
  { emoji: "🌞", label: "Radiant", color: "bg-pastel-yellow" },
  { emoji: "🌧️", label: "Heavy", color: "bg-pastel-blue" },
  { emoji: "🌸", label: "Grateful", color: "bg-pastel-pink" },
  { emoji: "�", label: "Motivated", color: "bg-pastel-orange" },
  { emoji: "🌙", label: "Dreamy", color: "bg-pastel-lavender" },
  { emoji: "�", label: "Anxious", color: "bg-pastel-ivory" },
  { emoji: "🪩", label: "Excited", color: "bg-pastel-green" },
  { emoji: "�️", label: "Calm", color: "bg-pastel-brown" },
];

type Mood = {
  emoji: string;
  label: string;
  color: string;
};

interface MoodSelectorProps {
  onMoodSelected: (mood: Mood) => void;
}

export default function MoodSelector({ onMoodSelected }: MoodSelectorProps) {
  const [selected, setSelected] = useState<Mood | null>(null);
  const [animating, setAnimating] = useState(false);

  const handleSelect = async (mood: Mood) => {
    setSelected(mood);
    setAnimating(true);
    // Save to Neon DB via API
    await axios.post("/api/save-mood", { mood: mood.label, emoji: mood.emoji });
    setTimeout(() => {
      onMoodSelected(mood);
    }, 700); // Animation duration
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pastel-pink via-pastel-ivory to-pastel-lavender font-garamond"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.h1 className="text-4xl mb-8 text-brown font-garamond" initial={{ y: -30 }} animate={{ y: 0 }}>
        What’s your vibe today?
      </motion.h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {moods.map((mood) => (
          <motion.button
            key={mood.label}
            className={`flex flex-col items-center justify-center rounded-2xl shadow-lg p-6 text-3xl text-brown font-garamond transition-all duration-300 ${mood.color} ${selected?.label === mood.label ? "ring-4 ring-pastel-pink scale-105" : "hover:scale-105"}`}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelect(mood)}
            disabled={animating}
          >
            <span>{mood.emoji}</span>
            <span className="mt-2 text-lg">{mood.label}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}