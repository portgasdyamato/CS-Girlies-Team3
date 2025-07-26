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

function EnhancedMoodSelector({ selectedMood, selectedEmoji, onMoodChange }: MoodSelectorProps) {
  const [, setLocation] = useLocation();
  const [customMood, setCustomMood] = useState(selectedMood);
  const [hoveredMood, setHoveredMood] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Mood categories
  const moodCategories = [
    { name: "All", color: "bg-pink-gradient" },
    { name: "Aesthetic", color: "bg-gradient-bg" },
    { name: "Vibe", color: "bg-purple-light" },
    { name: "Energy", color: "bg-pink-accent" },
    { name: "Era", color: "bg-purple-elevated" },
    { name: "Core", color: "bg-lavender" },
    { name: "Emotion", color: "bg-pink-light" },
  ];

  // Add category to each mood
  const fallbackMoods: (MoodSuggestion & { category: string })[] = [
    // Aesthetic, Vibe, etc.
    { mood: "soft grunge", emoji: "🖤", description: "Edgy but soft", category: "Aesthetic" },
    { mood: "cottagecore", emoji: "🌸", description: "Nature & cozy", category: "Core" },
    { mood: "dark feminine", emoji: "🦋", description: "Powerful & mysterious", category: "Energy" },
    { mood: "y2k baddie", emoji: "💿", description: "Retro & bold", category: "Era" },
    { mood: "ethereal fairy", emoji: "🧚", description: "Dreamy & magical", category: "Vibe" },
    { mood: "minimalist chic", emoji: "🤍", description: "Clean & elegant", category: "Aesthetic" },
    { mood: "vintage romantic", emoji: "🎀", description: "Classic & sweet", category: "Era" },
    { mood: "cyberpunk goddess", emoji: "🤖", description: "Futuristic & fierce", category: "Vibe" },
    { mood: "bohemian wanderer", emoji: "🌻", description: "Free spirit", category: "Core" },
    { mood: "gothic elegance", emoji: "🕸️", description: "Dark & refined", category: "Aesthetic" },
    // Emotions
    { mood: "happy", emoji: "😊", description: "Feeling joyful and light", category: "Emotion" },
    { mood: "sad", emoji: "😢", description: "Feeling down or blue", category: "Emotion" },
    { mood: "excited", emoji: "🤩", description: "Eager and thrilled", category: "Emotion" },
    { mood: "calm", emoji: "😌", description: "Peaceful and relaxed", category: "Emotion" },
    { mood: "anxious", emoji: "😰", description: "Nervous or uneasy", category: "Emotion" },
    { mood: "angry", emoji: "😡", description: "Frustrated or mad", category: "Emotion" },
    { mood: "confident", emoji: "😎", description: "Self-assured and bold", category: "Emotion" },
    { mood: "tired", emoji: "🥱", description: "Sleepy or low energy", category: "Emotion" },
    { mood: "in love", emoji: "😍", description: "Romantic and affectionate", category: "Emotion" },
    { mood: "hopeful", emoji: "🌈", description: "Optimistic and positive", category: "Emotion" },
    { mood: "lonely", emoji: "🥺", description: "Wanting connection", category: "Emotion" },
    { mood: "grateful", emoji: "🙏", description: "Thankful and appreciative", category: "Emotion" },
    { mood: "creative", emoji: "🎨", description: "Inspired and imaginative", category: "Emotion" },
    { mood: "bored", emoji: "😐", description: "Uninterested or restless", category: "Emotion" },
    { mood: "silly", emoji: "🤪", description: "Playful and goofy", category: "Emotion" },
    { mood: "shy", emoji: "😳", description: "Reserved or timid", category: "Emotion" },
    { mood: "proud", emoji: "🥰", description: "Satisfied and accomplished", category: "Emotion" },
    { mood: "overwhelmed", emoji: "😵", description: "Stressed or overloaded", category: "Emotion" },
    { mood: "peaceful", emoji: "🕊️", description: "Serene and tranquil", category: "Emotion" },
  ];
  const { data: apiMoods } = useQuery<MoodSuggestion[]>({
    queryKey: ["/api/mood-suggestions"],
  });
  // If API moods exist, add a default category
  const apiMoodsWithCategory = Array.isArray(apiMoods)
    ? apiMoods.map(m => ({ ...m, category: "Aesthetic" }))
    : [];
  const moodSuggestions = apiMoodsWithCategory.length > 0 ? apiMoodsWithCategory : fallbackMoods;

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

  // Filter moods by category
  const filteredMoods = selectedCategory === "All"
    ? moodSuggestions
    : moodSuggestions.filter(m => m.category === selectedCategory);

  return (
    <section className="min-h-screen p-6 page-enter">
      <div style={{background: '#fbc2eb', color: '#7b2ff2', padding: '1em', textAlign: 'center', fontWeight: 'bold', fontSize: '1.2em', borderRadius: '12px', marginBottom: '1em', boxShadow: '0 2px 12px #b993d6'}}>
        MuseMood Mood Selector is rendering! If you see this, the component is loaded.
      </div>
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="sparkle" style={{ top: '15%', left: '15%', animationDelay: '0s' }}></div>
        <div className="sparkle" style={{ top: '25%', left: '85%', animationDelay: '1.2s' }}></div>
        <div className="sparkle" style={{ top: '75%', left: '20%', animationDelay: '2.1s' }}></div>
        <div className="sparkle" style={{ top: '65%', left: '90%', animationDelay: '0.8s' }}></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-10 space-y-6">
          <div className="floating">
            <Sparkles className="w-16 h-16 text-pink-accent mx-auto mb-4 pulse-glow" />
          </div>
          <h2 className="text-6xl md:text-7xl font-bold text-purple-deep text-glow mb-6">
            How are you feeling? 💫
          </h2>
          <p className="text-xl md:text-2xl text-purple-light max-w-2xl mx-auto leading-relaxed">
            Select your mood category, then pick a mood or describe your unique vibe
          </p>
        </div>

        {/* Mood Category Selector */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {moodCategories.map(cat => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-5 py-2 rounded-full font-semibold text-lg interactive-button focus-ring transition-all duration-200 border-0 shadow-md ${selectedCategory === cat.name ? "pink-gradient text-purple-deep" : "glass-card text-purple-light"}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Enhanced Mood Grid */}
        <div className="glass-card rounded-3xl p-8 mb-8 pulse-glow hover-scale">
          <div className="flex items-center justify-center mb-8">
            <Heart className="w-6 h-6 text-pink-accent mr-3" />
            <h3 className="text-2xl font-semibold text-purple-light">Choose Your Mood</h3>
            <Heart className="w-6 h-6 text-pink-accent ml-3" />
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-4 mb-10">
            {filteredMoods.map((suggestion) => (
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


export default EnhancedMoodSelector;