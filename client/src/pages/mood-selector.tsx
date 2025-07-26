import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { ArrowRight, Sparkles, Heart } from "lucide-react";
import { MoodSuggestion } from "@/lib/types";

interface MoodSelectorProps {
  selectedMood: string;
  selectedEmoji: string;
  onMoodChange: (mood: string, emoji: string) => void;
}

export default function EnhancedMoodSelector({ selectedMood, selectedEmoji, onMoodChange }: MoodSelectorProps) {
  const [, setLocation] = useLocation();
  const [customMood, setCustomMood] = useState(selectedMood);
  const [hoveredMood, setHoveredMood] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { data: moodSuggestions = [] } = useQuery<MoodSuggestion[]>({
    queryKey: ["/api/mood-suggestions"],
  });

  // Mood suggestions for auto-complete
  const customSuggestions = [
    "soft grunge princess",
    "cottagecore dreamer", 
    "dark feminine energy",
    "y2k baddie vibes",
    "ethereal fairy core",
    "minimalist chic",
    "vintage romantic",
    "cyberpunk goddess",
    "bohemian wanderer",
    "gothic elegance"
  ];

  const handleEmojiSelect = (mood: string, emoji: string) => {
    onMoodChange(mood, emoji);
    setCustomMood(mood);
    
    // Add subtle haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const handleCustomMoodChange = (value: string) => {
    setCustomMood(value);
    onMoodChange(value, selectedEmoji);
    setShowSuggestions(value.length > 2);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setCustomMood(suggestion);
    onMoodChange(suggestion, selectedEmoji);
    setShowSuggestions(false);
  };

  const handleContinue = () => {
    if (customMood.trim()) {
      onMoodChange(customMood, selectedEmoji);
      setLocation("/journal");
    }
  };

  const filteredSuggestions = customSuggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(customMood.toLowerCase()) && 
    suggestion !== customMood
  );

  return (
    <section className="min-h-screen p-6 page-enter">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="sparkle" style={{ top: '15%', left: '15%', animationDelay: '0s' }}></div>
        <div className="sparkle" style={{ top: '25%', left: '85%', animationDelay: '1.2s' }}></div>
        <div className="sparkle" style={{ top: '75%', left: '20%', animationDelay: '2.1s' }}></div>
        <div className="sparkle" style={{ top: '65%', left: '90%', animationDelay: '0.8s' }}></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-16 space-y-6">
          <div className="floating">
            <Sparkles className="w-16 h-16 text-pink-accent mx-auto mb-4 pulse-glow" />
          </div>
          <h2 className="text-6xl md:text-7xl font-bold text-purple-deep text-glow mb-6">
            How are you feeling? 💫
          </h2>
          <p className="text-xl md:text-2xl text-purple-light max-w-2xl mx-auto leading-relaxed">
            Select your mood or describe your unique vibe
          </p>
          
          {/* Progress indicator */}
          <div className="flex justify-center space-x-2 mt-8">
            <div className="w-8 h-2 bg-pink-accent rounded-full"></div>
            <div className="w-8 h-2 bg-purple-light opacity-30 rounded-full"></div>
            <div className="w-8 h-2 bg-purple-light opacity-30 rounded-full"></div>
          </div>
        </div>

        {/* Enhanced Mood Grid */}
        <div className="glass-card rounded-3xl p-8 mb-8 pulse-glow hover-scale">
          <div className="flex items-center justify-center mb-8">
            <Heart className="w-6 h-6 text-pink-accent mr-3" />
            <h3 className="text-2xl font-semibold text-purple-light">Choose Your Mood</h3>
            <Heart className="w-6 h-6 text-pink-accent ml-3" />
          </div>
          
          <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-4 mb-10">
            {moodSuggestions.map((suggestion) => (
              <div
                key={suggestion.mood}
                className={`mood-emoji text-5xl md:text-6xl p-4 rounded-2xl glass-card text-center cursor-pointer interactive-button focus-ring ${
                  selectedMood === suggestion.mood ? 'selected' : ''
                }`}
                onClick={() => handleEmojiSelect(suggestion.mood, suggestion.emoji)}
                onMouseEnter={() => setHoveredMood(suggestion.mood)}
                onMouseLeave={() => setHoveredMood(null)}
                title={suggestion.description}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleEmojiSelect(suggestion.mood, suggestion.emoji);
                  }
                }}
              >
                <div className="relative">
                  {suggestion.emoji}
                  {hoveredMood === suggestion.mood && (
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-purple-elevated text-purple-light text-xs py-1 px-2 rounded-lg whitespace-nowrap z-10">
                      {suggestion.mood}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Enhanced Custom Mood Input */}
          <div className="space-y-6 relative">
            <Label className="text-purple-light text-lg font-medium flex items-center">
              <Sparkles className="w-5 h-5 mr-2" />
              Or describe your unique vibe:
            </Label>
            
            <div className="relative">
              <Input 
                value={customMood}
                onChange={(e) => handleCustomMoodChange(e.target.value)}
                placeholder="e.g., 'mysterious dark academia princess', 'soft cottagecore dreamer'" 
                className="w-full p-6 text-lg rounded-2xl glass-card text-purple-light placeholder-purple-light bg-transparent border-2 border-lavender focus:border-pink-accent outline-none transition-all duration-300 focus-ring"
                maxLength={100}
                onFocus={() => setShowSuggestions(true)}
              />
              
              {/* Character count */}
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xs text-purple-light opacity-60">
                {customMood.length}/100
              </div>
              
              {/* Auto-complete suggestions */}
              {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 glass-card rounded-xl p-2 z-20 max-h-48 overflow-y-auto">
                  {filteredSuggestions.slice(0, 5).map((suggestion, index) => (
                    <button
                      key={suggestion}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left p-3 rounded-lg hover:bg-purple-elevated text-purple-light transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Enhanced suggestions */}
            <div className="text-sm text-purple-light space-y-2">
              <p className="font-medium">Popular vibes:</p>
              <div className="flex flex-wrap gap-2">
                {["soft grunge", "cottagecore princess", "dark feminine", "y2k baddie", "ethereal fairy"].map((vibe) => (
                  <button
                    key={vibe}
                    onClick={() => handleSuggestionClick(vibe)}
                    className="px-3 py-1 text-xs glass-card rounded-full text-pink-accent hover-scale transition-all duration-200 interactive-button"
                  >
                    {vibe}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Continue Button */}
        <div className="text-center space-y-4">
          <Button 
            onClick={handleContinue}
            disabled={!customMood.trim()}
            className="px-12 py-5 pink-gradient text-purple-deep font-semibold text-xl rounded-full hover-scale transition-all duration-300 shadow-2xl border-0 interactive-button focus-ring"
          >
            <ArrowRight className="w-6 h-6 mr-3" />
            Continue to Journal
          </Button>
          
          {customMood.trim() && (
            <p className="text-purple-light text-sm animate-fade-in">
              Perfect! Let's explore your <span className="text-pink-accent font-medium">"{customMood}"</span> aesthetic ✨
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

// Add this CSS for the fade-in animation
const styles = `
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .animate-fade-in {
    animation: fade-in 0.3s ease-out;
  }
`;