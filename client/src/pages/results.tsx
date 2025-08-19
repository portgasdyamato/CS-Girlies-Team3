import React, { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import OutfitCard from "@/components/outfit-card";
import MoodboardCard from "@/components/moodboard-card";
import PoemCard from "@/components/poem-card";
import PlaylistCard from "@/components/playlist-card";
import { Save, Share, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { GenerationResult } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

interface ResultsProps {
  generationResult: GenerationResult | null;
  selectedMood: string;
  onStartOver: () => void;
  sessionId?: string;
}

export default function Results({ generationResult, selectedMood, onStartOver, sessionId }: ResultsProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [journalMood, setJournalMood] = useState<string>("");
  const [journalEntry, setJournalEntry] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Get mood and journal entry from localStorage on component mount
  useEffect(() => {
    // Try both possible keys for mood to ensure compatibility
    const storedMood = localStorage.getItem('journalMood') || localStorage.getItem('selectedMood');
    const storedEntry = localStorage.getItem('journalEntry');
    
    if (storedMood) {
      setJournalMood(storedMood);
    }
    
    if (storedEntry) {
      setJournalEntry(storedEntry);
    }
    
    // Simulate AI generation loading - more realistic timing
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Slightly longer loading time for more realism
    
    return () => clearTimeout(timer);
  }, []);

  // Define the expected session data type
  interface SessionData {
    id: string;
    generatedOutfit: GenerationResult["outfit"];
    generatedMoodboard: GenerationResult["moodboard"];
    generatedPoem: GenerationResult["poem"];
    generatedPlaylist: GenerationResult["playlist"];
    mood: string;
  }

  // Load session data if sessionId is provided
  const { data: sessionData } = useQuery<SessionData>({
    queryKey: [`/api/sessions/${sessionId}`],
    enabled: !!sessionId && !generationResult,
  });

  // Mock generated content based on the mood
  const mockGeneratedContent = useMemo(() => {
    const currentMood = journalMood || selectedMood || 'happy';
    
    const moodBasedContent: Record<string, any> = {
      happy: {
        outfit: {
          styleName: "Sunshine Vibes",
          description: "A bright and cheerful outfit to match your happy mood",
          colorPalette: ["#FFD700", "#FFA500", "#F5F5DC", "#FFFFFF"],
          instagramCaption: "Radiating joy today in my sunshine-inspired look! ☀️ #HappyVibes",
          imagePrompt: "A bright and cheerful outfit with yellow sundress, white sneakers, straw hat, sunglasses",
          image: { url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3" }
        },
        moodboard: {
          theme: "Golden Hour Joy",
          elements: ["Sunshine", "Flowers", "Beach", "Laughter"],
          colorScheme: ["#FFD700", "#FFA500", "#87CEEB", "#32CD32"],
          aestheticTags: ["#SunnyDays", "#HappyVibes", "#GoldenHour", "#SummerFun"]
        },
        poem: "Sunshine filters through morning air,\nSmiles bloom like flowers everywhere.\nLaughter rises, light and free,\nJoy fills each moment endlessly.",
        playlist: {
          name: "Happy Beats",
          description: "Uplifting songs to keep your mood bright and joyful",
          tracks: [
            { artist: "Katrina & The Waves", song: "Walking on Sunshine", duration: "3:43" },
            { artist: "Pharrell Williams", song: "Happy", duration: "3:53" },
            { artist: "Lizzo", song: "Good as Hell", duration: "2:39" },
            { artist: "Mark Ronson ft. Bruno Mars", song: "Uptown Funk", duration: "4:30" },
            { artist: "Justin Timberlake", song: "Can't Stop the Feeling!", duration: "3:56" }
          ]
        }
      },
      sad: {
        outfit: {
          styleName: "Comfort & Calm",
          description: "A soft, comforting outfit for reflective moments",
          colorPalette: ["#808080", "#D3D3D3", "#000080", "#F5F5F5"],
          instagramCaption: "Finding comfort in soft layers and muted tones today. 🌧️ #SelfCareDay",
          imagePrompt: "A cozy, comfortable outfit with oversized sweater, comfortable joggers, fuzzy socks, and a warm scarf",
          image: { url: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?ixlib=rb-4.0.3" }
        },
        moodboard: {
          theme: "Peaceful Melancholy",
          elements: ["Rain", "Coffee", "Books", "Window"],
          colorScheme: ["#708090", "#4682B4", "#D3D3D3", "#F5F5F5"],
          aestheticTags: ["#RainyDay", "#MelancholicMood", "#Introspection", "#SolitudeAndPeace"]
        },
        poem: "Teardrops fall like gentle rain,\nWashing away unseen pain.\nIn solitude, find your space,\nEmotions flow at their own pace.",
        playlist: {
          name: "Melancholy Melodies",
          description: "Soulful songs that embrace your emotions and provide comfort",
          tracks: [
            { artist: "Adele", song: "Someone Like You", duration: "4:45" },
            { artist: "Coldplay", song: "Fix You", duration: "4:55" },
            { artist: "Bon Iver", song: "Skinny Love", duration: "3:58" },
            { artist: "Kodaline", song: "All I Want", duration: "5:05" },
            { artist: "Billie Eilish", song: "when the party's over", duration: "3:16" }
          ]
        }
      },
      excited: {
        outfit: {
          styleName: "Vibrant Energy",
          description: "Bold and energetic outfit to match your excitement",
          colorPalette: ["#FF4500", "#9932CC", "#00BFFF", "#000000"],
          instagramCaption: "Buzzing with energy in this bold look! Ready for anything today! 🎉 #ExcitedVibes",
          imagePrompt: "A bold, energetic outfit with a colorful blazer, statement tee, bright sneakers, and fun accessories",
          image: { url: "https://images.unsplash.com/photo-1520013817300-1f4c1cb245ef?ixlib=rb-4.0.3" }
        },
        moodboard: {
          theme: "Electric Enthusiasm",
          elements: ["Fireworks", "Neon", "Celebration", "Adventure"],
          colorScheme: ["#FF4500", "#FFD700", "#00BFFF", "#9932CC"],
          aestheticTags: ["#ElectricVibes", "#ExcitedEnergy", "#CelebrationMood", "#BoldAndBright"]
        },
        poem: "Sparks fly with each excited breath,\nAnticipation conquers any depth.\nPossibilities dance through the air,\nAdventures await everywhere!",
        playlist: {
          name: "Energy Boost",
          description: "High-energy tracks to fuel your excitement and keep you pumped",
          tracks: [
            { artist: "Queen", song: "Don't Stop Me Now", duration: "3:29" },
            { artist: "Macklemore & Ryan Lewis", song: "Can't Hold Us", duration: "4:18" },
            { artist: "David Guetta ft. Sia", song: "Titanium", duration: "4:05" },
            { artist: "Black Eyed Peas", song: "I Got a Feeling", duration: "4:49" },
            { artist: "Panic! At The Disco", song: "High Hopes", duration: "3:10" }
          ]
        }
      },
      calm: {
        outfit: {
          styleName: "Serene Simplicity",
          description: "A flowing, comfortable outfit for peaceful moments",
          colorPalette: ["#F5F5DC", "#FFFFFF", "#808080", "#D2B48C"],
          instagramCaption: "Finding peace in simplicity today. 🍃 #SereneStyle",
          imagePrompt: "A flowing, comfortable outfit with linen shirt, wide-leg pants, minimalist sandals, and simple jewelry",
          image: { url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3" }
        },
        moodboard: {
          theme: "Tranquil Moments",
          elements: ["Water", "Sky", "Minimalism", "Nature"],
          colorScheme: ["#F0F8FF", "#E0FFFF", "#F5F5DC", "#FFFFFF"],
          aestheticTags: ["#CalmMoments", "#Tranquility", "#MinimalBeauty", "#PeacefulDays"]
        },
        poem: "Calm waters reflect the sky above,\nSerene thoughts float like a gentle dove.\nBreathe in peace with every breath,\nFind tranquility in this moment's depth.",
        playlist: {
          name: "Peaceful Ambient",
          description: "Gentle melodies to maintain your calm state and soothe your mind",
          tracks: [
            { artist: "Claude Debussy", song: "Claire de Lune", duration: "5:14" },
            { artist: "Marconi Union", song: "Weightless", duration: "8:09" },
            { artist: "Erik Satie", song: "Gymnopédie No.1", duration: "3:05" },
            { artist: "All Saints", song: "Pure Shores", duration: "4:24" },
            { artist: "Enya", song: "Echoes of Time", duration: "4:08" }
          ]
        }
      },
      angry: {
        outfit: {
          styleName: "Bold Expression",
          description: "A powerful outfit to channel and transform energy",
          colorPalette: ["#000000", "#8B0000", "#696969", "#A9A9A9"],
          instagramCaption: "Channeling intensity through style today. 🔥 #PowerLook",
          imagePrompt: "A powerful outfit with leather jacket, black jeans, combat boots, and edgy accessories",
          image: { url: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?ixlib=rb-4.0.3" }
        },
        moodboard: {
          theme: "Powerful Emotions",
          elements: ["Fire", "Steel", "Storm", "Strength"],
          colorScheme: ["#8B0000", "#000000", "#696969", "#A9A9A9"],
          aestheticTags: ["#IntenseEnergy", "#PowerfulEmotions", "#StrengthInStyle", "#EdgeAesthetic"]
        },
        poem: "Thunder rolls within my chest,\nLightning thoughts refuse to rest.\nFeel the power in your rage,\nThen release it from its cage.",
        playlist: {
          name: "Power Release",
          description: "Intense tracks to help process and channel your powerful emotions",
          tracks: [
            { artist: "Rage Against The Machine", song: "Killing In The Name", duration: "5:13" },
            { artist: "Limp Bizkit", song: "Break Stuff", duration: "2:46" },
            { artist: "Linkin Park", song: "Given Up", duration: "3:09" },
            { artist: "Three Days Grace", song: "I Hate Everything About You", duration: "3:51" },
            { artist: "Green Day", song: "Know Your Enemy", duration: "3:11" }
          ]
        }
      },
      romantic: {
        outfit: {
          styleName: "Romantic Dreams",
          description: "A soft, dreamy outfit with feminine touches",
          colorPalette: ["#FFC0CB", "#FFFFFF", "#F5F5DC", "#FFB6C1"],
          instagramCaption: "Lost in romantic thoughts and dreamy fabrics today. 💕 #RomanticStyle",
          imagePrompt: "A soft, dreamy outfit with flowy dress, delicate jewelry, soft cardigan, and ballet flats",
          image: { url: "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?ixlib=rb-4.0.3" }
        },
        moodboard: {
          theme: "Love & Tenderness",
          elements: ["Roses", "Candles", "Sunset", "Lace"],
          colorScheme: ["#FFC0CB", "#FFB6C1", "#FFFFFF", "#F5F5DC"],
          aestheticTags: ["#RomanticMood", "#LoveAesthetic", "#DreamyVibes", "#SoftGlam"]
        },
        poem: "Whispers of love fill the air,\nHearts connected everywhere.\nTender moments, sweet embrace,\nTime stands still in love's warm grace.",
        playlist: {
          name: "Love Songs",
          description: "Romantic tracks to accompany your loving and tender mood",
          tracks: [
            { artist: "Elvis Presley", song: "Can't Help Falling In Love", duration: "2:57" },
            { artist: "John Legend", song: "All of Me", duration: "4:29" },
            { artist: "Ed Sheeran", song: "Perfect", duration: "4:23" },
            { artist: "Etta James", song: "At Last", duration: "2:59" },
            { artist: "Adele", song: "Make You Feel My Love", duration: "3:32" }
          ]
        }
      },
      nostalgic: {
        outfit: {
          styleName: "Nostalgic Charm",
          description: "A vintage-inspired outfit evoking fond memories",
          colorPalette: ["#D2B48C", "#F5DEB3", "#000000", "#FFFFFF"],
          instagramCaption: "Taking a trip down memory lane with today's vintage-inspired look. 🌸 #NostalgicStyle",
          imagePrompt: "A vintage-inspired outfit with high-waisted jeans, vintage band tee, retro sneakers, and classic watch",
          image: { url: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?ixlib=rb-4.0.3" }
        },
        moodboard: {
          theme: "Memories Revisited",
          elements: ["Vinyl Records", "Polaroids", "Vintage Cars", "Old Books"],
          colorScheme: ["#D2B48C", "#F5DEB3", "#808080", "#000000"],
          aestheticTags: ["#NostalgicVibes", "#VintageAesthetic", "#MemoryLane", "#RetroStyle"]
        },
        poem: "Sepia-toned memories dance,\nMoments caught in time's sweet trance.\nYesterday's joys still linger near,\nPrecious memories we hold so dear.",
        playlist: {
          name: "Nostalgic Tunes",
          description: "Classic songs that evoke fond memories and warm nostalgia",
          tracks: [
            { artist: "Fleetwood Mac", song: "Dreams", duration: "4:14" },
            { artist: "Billy Joel", song: "Vienna", duration: "3:34" },
            { artist: "Toto", song: "Africa", duration: "4:55" },
            { artist: "Tracy Chapman", song: "Fast Car", duration: "4:56" },
            { artist: "Cyndi Lauper", song: "Time After Time", duration: "4:01" }
          ]
        }
      },
      dreamy: {
        outfit: {
          styleName: "Ethereal Dream",
          description: "A flowing, whimsical outfit for dreamy days",
          colorPalette: ["#E6E6FA", "#D8BFD8", "#FFFFFF", "#FFE4E1"],
          instagramCaption: "Floating through the day in layers of dreamy fabrics and ethereal vibes. ✨ #DreamyStyle",
          imagePrompt: "A flowing, whimsical outfit with pastel maxi dress, iridescent accessories, soft cardigan, and delicate sandals",
          image: { url: "https://images.unsplash.com/photo-1604004555489-723a93d6ce74?ixlib=rb-4.0.3" }
        },
        moodboard: {
          theme: "Fantasy World",
          elements: ["Clouds", "Stars", "Bubbles", "Prisms"],
          colorScheme: ["#E6E6FA", "#D8BFD8", "#B0E0E6", "#FFE4E1"],
          aestheticTags: ["#DreamyVibes", "#EtherealStyle", "#FantasyAesthetic", "#WhimsicalMood"]
        },
        poem: "Floating on clouds of fantasy,\nDrifting through worlds of reverie.\nImagination unfurls its wings,\nIn dreams we find the loveliest things.",
        playlist: {
          name: "Dreamy Soundscapes",
          description: "Ethereal songs to enhance your dreamy state and fuel your imagination",
          tracks: [
            { artist: "Langhorn Slim", song: "Dreams", duration: "3:01" },
            { artist: "Florence + The Machine", song: "Cosmic Love", duration: "4:15" },
            { artist: "Fleetwood Mac", song: "Rhiannon", duration: "4:11" },
            { artist: "Nat King Cole", song: "Stardust", duration: "3:15" },
            { artist: "Ella Fitzgerald", song: "Dream A Little Dream Of Me", duration: "3:19" }
          ]
        }
      }
    };

    // Default to happy if no mood is found
    return moodBasedContent[currentMood] || moodBasedContent.happy;
  }, [journalMood, selectedMood]);

  const currentResult = generationResult || (sessionData ? {
    sessionId: sessionData.id,
    outfit: sessionData.generatedOutfit,
    moodboard: sessionData.generatedMoodboard,
    poem: sessionData.generatedPoem,
    playlist: sessionData.generatedPlaylist
  } : {
    sessionId: "local-session",
    outfit: mockGeneratedContent.outfit,
    moodboard: mockGeneratedContent.moodboard,
    poem: mockGeneratedContent.poem,
    playlist: mockGeneratedContent.playlist
  });

  const currentMood = selectedMood || journalMood || sessionData?.mood || "happy";

  if (!currentResult) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bitcount-grid-double-uniquifier">
        <div className="text-center glass-card rounded-3xl p-8 bitcount-grid-double-uniquifier">
          <h2 className="text-2xl font-bold text-purple-deep mb-4 bitcount-grid-double-uniquifier">No results to show</h2>
          <p className="text-purple-deep mb-6 bitcount-grid-double-uniquifier">Start your mood journey to see your generated aesthetic.</p>
          <Button onClick={() => setLocation("/")} className="pink-gradient text-purple-deep border-0">
            Start Over
          </Button>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    // Store the generation in user's saved collection
    const savedAesthetics = JSON.parse(localStorage.getItem('savedAesthetics') || '[]');
    const newSavedAesthetic = {
      id: Date.now().toString(),
      mood: currentMood,
      timestamp: new Date().toISOString(),
      result: currentResult,
      journalEntry: journalEntry
    };
    
    savedAesthetics.push(newSavedAesthetic);
    localStorage.setItem('savedAesthetics', JSON.stringify(savedAesthetics));
    
    toast({
      title: "Mood session saved! ✨",
      description: "Your aesthetic has been saved to your collection.",
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `My ${currentMood} MuseMood Aesthetic`,
          text: `Check out my ${currentMood} mood aesthetic created with AI!`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Share link has been copied to your clipboard.",
      });
    }
  };

  const handleStartOver = () => {
    // Clear the journal entry and mood from localStorage
    localStorage.removeItem('journalEntry');
    localStorage.removeItem('journalMood');
    localStorage.removeItem('selectedMood');
    
    if (onStartOver) {
      onStartOver();
    }
    setLocation("/");
  };

  return (
    <section className="min-h-screen p-6 bitcount-grid-double-uniquifier">
      <div className="max-w-7xl mx-auto bitcount-grid-double-uniquifier">
        {/* Header */}
        <div className="text-center mb-12 bitcount-grid-double-uniquifier">
          <h2 className="text-5xl font-bold text-purple-deep text-glow mb-4 bitcount-grid-double-uniquifier">
            Your {currentMood.charAt(0).toUpperCase() + currentMood.slice(1)} Aesthetic ✨
          </h2>
          <p className="text-xl text-purple-deep bitcount-grid-double-uniquifier">
            {isLoading ? 
              "AI is crafting your personalized experience..." : 
              "AI has crafted your complete mood experience"
            }
          </p>
          {journalEntry && (
            <div className="mt-4 max-w-2xl mx-auto">
              <p className="text-sm italic text-purple-deep/70 line-clamp-3">
                "{journalEntry.length > 120 ? journalEntry.substring(0, 120) + '...' : journalEntry}"
              </p>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-96">
            <div className="w-16 h-16 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
            <p className="mt-6 text-xl text-purple-deep">Generating your {currentMood} aesthetic...</p>
          </div>
        ) : (
          /* Results Grid - Using Bento Grid Layout */
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-12">
            {/* Large featured card - Moodboard */}
            <div className="md:col-span-8 md:row-span-2">
              <MoodboardCard moodboard={currentResult.moodboard} />
            </div>
            
            {/* Poem - Medium card */}
            <div className="md:col-span-4">
              <PoemCard poem={currentResult.poem} />
            </div>
            
            {/* Outfit - Medium card */}
            <div className="md:col-span-4">
              <OutfitCard outfit={currentResult.outfit} />
            </div>
            
            {/* Playlist - Full width at bottom */}
            <div className="md:col-span-12">
              <PlaylistCard playlist={currentResult.playlist} />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="text-center space-x-4">
          <Button 
            onClick={handleSave}
            className="px-8 py-3 glass-card text-purple-light font-semibold rounded-full hover-scale transition-all duration-300 border-0"
          >
            <Save className="w-5 h-5 mr-2" />
            Save This Mood
          </Button>
          <Button 
            onClick={handleShare}
            className="px-8 py-3 pink-gradient text-purple-deep font-semibold rounded-full hover-scale transition-all duration-300 border-0"
          >
            <Share className="w-5 h-5 mr-2" />
            Share My Aesthetic
          </Button>
          <Button 
            onClick={handleStartOver}
            className="px-8 py-3 glass-card text-purple-light font-semibold rounded-full hover-scale transition-all duration-300 border-0"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Create New Mood
          </Button>
        </div>
      </div>
    </section>
  );
}
