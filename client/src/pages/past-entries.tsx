import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import axios from 'axios';

export default function PastEntries() {
  const [entries, setEntries] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    axios.get('/api/get-entries').then(res => setEntries(res.data));
  }, []);

  return (
    <motion.div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pastel-lavender via-pastel-peach to-pastel-mint eb-garamond-uniquifier">
      <div className="w-full max-w-2xl mx-auto mt-12 mb-8">
        <button className="btn-purple px-6 py-2 rounded-lg mb-8" onClick={() => setLocation('/journal-entry')}>Back to Diary</button>
        <div className="space-y-6">
          <AnimatePresence>
            {entries.map((entry, i) => (
              <motion.div
                key={i}
                className={`glass-card p-6 rounded-xl shadow-md cursor-pointer transition-all duration-300 ${entry.style === 'cute' ? 'bg-white/80 border-4 border-pink-200' : ''}`}
                style={entry.style === 'cute' ? { background: 'url(/cute-page-bg.png), #fff5f8', backgroundSize: 'cover' } : {}}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                layout
                onClick={() => setExpanded(expanded === i ? null : i)}
              >
                <div className="flex items-center gap-4 mb-2">
                  {entry.mood && <span className="text-2xl">{entry.mood.emoji}</span>}
                  {entry.mood && <span className="text-base font-semibold">{entry.mood.label}</span>}
                  <span className="text-gray-500 text-sm">{new Date(entry.timestamp).toLocaleString()}</span>
                  <span className={`ml-auto px-3 py-1 rounded-full text-xs font-bold ${entry.style === 'cute' ? 'bg-pink-200 text-pink-600' : 'bg-yellow-100 text-yellow-700'}`}>{entry.style === 'cute' ? 'Cute' : 'Vintage'}</span>
                </div>
                <div className="text-lg eb-garamond-uniquifier">
                  {expanded === i ? entry.text : entry.text.slice(0, 80) + (entry.text.length > 80 ? '...' : '')}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
} 