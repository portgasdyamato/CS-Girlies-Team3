import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import axios from 'axios';

export default function JournalEntry() {
  const [entry, setEntry] = useState('');
  const [, setLocation] = useLocation();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [flipping, setFlipping] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await axios.post('/api/save-entry', { entry, timestamp: new Date().toISOString() });
      setEntry('');
    } catch (e) {
      setError('Failed to save entry. Please try again.');
    }
    setSaving(false);
  };

  const handleBack = () => {
    setFlipping(true);
    setTimeout(() => setLocation('/diary-cover'), 700);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[url('/paper-texture.png')] bg-cover eb-garamond-uniquifier relative">
      {/* Starry background */}
      <div className="absolute inset-0 pointer-events-none z-0" style={{background: 'radial-gradient(ellipse at 50% 40%, #2d1850 0%, #4b2e7a 60%, #a78bfa 100%)', opacity: 0.3}} />
      <div className="flex flex-col items-center w-full max-w-xl z-10">
        <AnimatePresence mode="wait">
          {!flipping && (
            <motion.div
              key="journal"
              className="glass-card p-8 rounded-2xl shadow-xl flex flex-col items-center w-full"
              initial={{ rotateY: 100, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: -100, opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.77, 0, 0.175, 1] }}
              style={{ perspective: 1200, background: 'rgba(255,255,255,0.85)' }}
              aria-label="Journal Entry Page"
            >
              <h2 className="text-3xl font-bold mb-6">Write your thoughts</h2>
              <textarea
                className="w-full h-48 p-4 rounded-lg border border-gray-200 mb-6 eb-garamond-uniquifier text-lg focus:ring-2 focus:ring-pink-300"
                placeholder="Write your thoughts..."
                value={entry}
                onChange={e => setEntry(e.target.value)}
                aria-label="Journal entry textarea"
                autoFocus
              />
              {error && <div className="text-red-500 mb-2">{error}</div>}
              <div className="flex gap-4">
                <button className="btn-purple px-6 py-2 rounded-lg" onClick={handleSave} disabled={saving || !entry.trim()} aria-label="Save Entry">
                  {saving ? 'Saving...' : 'Save Entry'}
                </button>
                <button className="btn-purple px-6 py-2 rounded-lg" onClick={() => setLocation('/past-entries')} aria-label="View Past Entries">View Past Entries</button>
                <button className="btn-purple px-6 py-2 rounded-lg" onClick={handleBack} aria-label="Back to Diary Cover">Back</button>
              </div>
              {!entry && <div className="text-gray-400 mt-8">Start writing your vintage diary entry above...</div>}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
