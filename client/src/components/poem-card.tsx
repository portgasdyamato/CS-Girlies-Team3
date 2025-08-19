import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PoemCardProps {
  poem: string;
}

export default function PoemCard({ poem }: PoemCardProps) {
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(poem);
    toast({
      title: "Poem copied!",
      description: "Your beautiful poem has been copied to clipboard.",
    });
  };

  // Parse poem - handle both string and object formats
  const formatPoem = () => {
    // If poem is a string
    if (typeof poem === 'string') {
      const lines = poem.split('\n');
      const titleLine = lines.find(line => line.startsWith('Title:'));
      return {
        title: titleLine ? titleLine.replace('Title:', '').trim() : "Your Poem",
        content: lines.filter(line => !line.startsWith('Title:') && line.trim()).join('\n')
      };
    } 
    // If poem is an object with title and content
    else if (poem && typeof poem === 'object' && 'title' in poem && 'content' in poem) {
      return {
        title: (poem as any).title,
        content: (poem as any).content
      };
    }
    // Default fallback
    return {
      title: "Your Poem",
      content: poem || "A beautiful poem just for you."
    };
  };

  const { title, content } = formatPoem();

  return (
    <div className="glass-card rounded-3xl p-6 hover-scale pulse-glow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-semibold text-purple-light">Your Poem 📜</h3>
        <Button 
          onClick={handleCopy}
          size="icon"
          className="glass-card rounded-full text-pink-accent hover-scale border-0"
        >
          <Copy className="w-5 h-5" />
        </Button>
      </div>
      
      <div className="space-y-4">
        <div className="text-center">
          <h4 className="text-xl font-semibold text-pink-accent mb-4">{title}</h4>
          <div className="text-purple-deep leading-relaxed space-y-2 italic text-lg whitespace-pre-line">
            {content}
          </div>
        </div>
      </div>
    </div>
  );
}
