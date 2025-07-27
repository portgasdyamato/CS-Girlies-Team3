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

  const currentResult = generationResult || (sessionData ? {
    sessionId: sessionData.id,
    outfit: sessionData.generatedOutfit,
    moodboard: sessionData.generatedMoodboard,
    poem: sessionData.generatedPoem,
    playlist: sessionData.generatedPlaylist
  } : null);

  const currentMood = selectedMood || sessionData?.mood || "";

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
    toast({
      title: "Mood session saved! ✨",
      description: "Your aesthetic has been saved to your collection.",
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My MuseMood Aesthetic",
          text: `Check out my ${selectedMood} mood aesthetic created with AI!`,
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
    onStartOver();
    setLocation("/");
  };

  return (
    <section className="min-h-screen p-6 bitcount-grid-double-uniquifier">
      <div className="max-w-7xl mx-auto bitcount-grid-double-uniquifier">
        {/* Header */}
        <div className="text-center mb-12 bitcount-grid-double-uniquifier">
          <h2 className="text-5xl font-bold text-purple-deep text-glow mb-4 bitcount-grid-double-uniquifier">
            Your Aesthetic Universe ✨
          </h2>
          <p className="text-xl text-purple-deep bitcount-grid-double-uniquifier">
            AI has crafted your complete mood experience
          </p>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <OutfitCard outfit={currentResult.outfit} />
          <MoodboardCard moodboard={currentResult.moodboard} />
          <PoemCard poem={currentResult.poem} />
          <PlaylistCard playlist={currentResult.playlist} />
        </div>

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
