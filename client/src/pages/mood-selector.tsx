import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { MoodSuggestion } from "@/lib/types";

interface MoodSelectorProps {
  selectedMood: string;
  selectedEmoji: string;
  onMoodChange: (mood: string, emoji: string) => void;
}

export default function MoodSelector({ selectedMood, selectedEmoji, onMoodChange }: MoodSelectorProps) {
  const [, setLocation] = useLocation();
  const [customMood, setCustomMood] = useState(selectedMood);

  const { data: moodSuggestions = [] } = useQuery<MoodSuggestion[]>({
    queryKey: ["/api/mood-suggestions"],
  });

  const handleEmojiSelect = (mood: string, emoji: string) => {
    onMoodChange(mood, emoji);
    setCustomMood(mood);
  };

  const handleCustomMoodChange = (value: string) => {
    setCustomMood(value);
    onMoodChange(value, selectedEmoji);
  };

  const handleContinue = () => {
    if (customMood.trim()) {
      onMoodChange(customMood, selectedEmoji);
      setLocation("/journal");
    }
  };

  return (
    <section className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-purple-deep text-glow mb-4">
            How are you feeling? 💫
          </h2>
          <p className="text-xl text-purple-deep">
            Select your mood or describe your vibe
          </p>
        </div>

        {/* Mood Grid */}
        <div className="glass-card rounded-3xl p-8 mb-8 pulse-glow">
          <h3 className="text-2xl font-semibold text-purple-light mb-6 text-center">Choose Your Mood</h3>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-4 mb-8">
            {moodSuggestions.map((suggestion) => (
              <div
                key={suggestion.mood}
                className={`mood-emoji text-6xl p-4 rounded-2xl glass-card text-center cursor-pointer ${
                  selectedMood === suggestion.mood ? 'selected' : ''
                }`}
                onClick={() => handleEmojiSelect(suggestion.mood, suggestion.emoji)}
                title={suggestion.description}
              >
                {suggestion.emoji}
              </div>
            ))}
          </div>
          
          {/* Custom Mood Input */}
          <div className="space-y-4">
            <Label className="text-purple-light text-lg font-medium">Or describe your vibe:</Label>
            <Input 
              value={customMood}
              onChange={(e) => handleCustomMoodChange(e.target.value)}
              placeholder="e.g., 'sad baddie', 'soft girl in Paris', 'dark academia princess'" 
              className="w-full p-4 rounded-2xl glass-card text-purple-light placeholder-purple-light bg-transparent border-2 border-lavender focus:border-pink-accent outline-none transition-all duration-300"
            />
            <div className="text-sm text-purple-light">
              Suggestions: soft grunge, cottagecore princess, dark feminine, y2k baddie
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <Button 
            onClick={handleContinue}
            disabled={!customMood.trim()}
            className="px-10 py-4 pink-gradient text-purple-deep font-semibold text-lg rounded-full hover-scale transition-all duration-300 shadow-xl border-0"
          >
            <ArrowRight className="w-5 h-5 mr-2" />
            Continue to Journal
          </Button>
        </div>
      </div>
    </section>
  );
}
