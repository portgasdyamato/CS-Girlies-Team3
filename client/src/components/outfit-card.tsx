import { Button } from "@/components/ui/button";
import { Download, Shirt } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OutfitCardProps {
  outfit: {
    styleName: string;
    description: string;
    colorPalette: string[];
    instagramCaption: string;
    imagePrompt: string;
    image?: { url: string };
  };
}

export default function OutfitCard({ outfit }: OutfitCardProps) {
  const { toast } = useToast();

  const handleDownload = async () => {
    if (outfit.image?.url) {
      try {
        const response = await fetch(outfit.image.url);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${outfit.styleName.replace(/\s+/g, '_')}_outfit.png`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast({
          title: "Download started!",
          description: "Your outfit image is being downloaded.",
        });
      } catch (error) {
        toast({
          title: "Download failed",
          description: "Could not download the outfit image.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "No image available",
        description: "The outfit image is still being generated.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 hover-scale pulse-glow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-semibold text-purple-100">Your Outfit ✨</h3>
        <Button 
          onClick={handleDownload}
          size="icon"
          className="glass-card rounded-full text-rose-400 hover-scale border-0"
        >
          <Download className="w-5 h-5" />
        </Button>
      </div>
      
      {/* AI-generated outfit visualization */}
      <div className="aspect-square rounded-2xl glass-card mb-4 flex items-center justify-center overflow-hidden">
        {outfit.image?.url ? (
          <img 
            src={outfit.image.url} 
            alt={outfit.styleName}
            className="w-full h-full object-cover rounded-2xl"
          />
        ) : (
          <div className="text-center text-purple-deep">
            <Shirt className="w-16 h-16 mb-4 text-pink-accent mx-auto" />
            <p className="text-lg">AI Generated Outfit</p>
            <p className="text-sm text-purple-light">{outfit.styleName}</p>
          </div>
        )}
      </div>
      
      {/* Outfit Details */}
      <div className="space-y-3">
        <div>
          <h4 className="text-lg font-medium text-purple-deep mb-2">Style Name</h4>
          <p className="text-pink-accent font-semibold">{outfit.styleName}</p>
        </div>
        
        <div>
          <h4 className="text-lg font-medium text-purple-deep mb-2">Color Palette</h4>
          <div className="flex space-x-2">
            {outfit.colorPalette.map((color, index) => (
              <div 
                key={index}
                className="w-8 h-8 rounded-full border-2 border-purple-light/20"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-lg font-medium text-purple-deep mb-2">Instagram Caption</h4>
          <p className="text-purple-deep text-sm italic">{outfit.instagramCaption}</p>
        </div>
      </div>
    </div>
  );
}
