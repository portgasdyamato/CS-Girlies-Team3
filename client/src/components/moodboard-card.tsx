import { Button } from "@/components/ui/button";
import { Share } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MoodboardCardProps {
  moodboard: {
    theme: string;
    elements: string[];
    colorScheme: string[];
    aestheticTags: string[];
  };
}

// Stock aesthetic images for moodboard
const stockImages = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
  "https://images.unsplash.com/photo-1490750967868-88aa4486c946?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
  "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
  "https://images.unsplash.com/photo-1502780402662-acc01917115e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"
];

export default function MoodboardCard({ moodboard }: MoodboardCardProps) {
  const { toast } = useToast();

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "My MuseMood Moodboard",
        text: `Check out my ${moodboard.theme} moodboard!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Moodboard link copied to clipboard.",
      });
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 hover-scale pulse-glow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-semibold text-white">Your Moodboard 🎨</h3>
        <Button 
          onClick={handleShare}
          size="icon"
          className="glass-card rounded-full text-pink-accent hover-scale border-0"
        >
          <Share className="w-5 h-5" />
        </Button>
      </div>
      
      {/* Moodboard Grid */}
      <div className="grid grid-cols-3 gap-2 rounded-2xl overflow-hidden mb-4">
        {stockImages.map((imageUrl, index) => (
          <img 
            key={index}
            src={imageUrl} 
            alt={`Aesthetic element ${index + 1}`}
            className="aspect-square object-cover hover:scale-105 transition-transform duration-300" 
          />
        ))}
      </div>
      
      {/* Color Scheme */}
      <div className="mb-4">
        <h4 className="text-lg font-medium text-white mb-2">Color Scheme</h4>
        <div className="flex space-x-2">
          {moodboard.colorScheme.map((color, index) => (
            <div 
              key={index}
              className="w-8 h-8 rounded-full border-2 border-white/20"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>
      
      <div>
        <p className="text-cream text-sm">
          <span className="font-medium">Aesthetic Tags:</span>{" "}
          {moodboard.aestheticTags.join(", ")}
        </p>
      </div>
    </div>
  );
}
