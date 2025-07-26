import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Home, Heart, Book, Sparkles } from "lucide-react";

export default function FloatingNavigation() {
  const [location, setLocation] = useLocation();

  if (location === "/") return null;

  return (
    <nav className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="flex space-x-2 glass-card rounded-full p-2">
        <Button
          onClick={() => setLocation("/")}
          size="icon"
          className={`w-12 h-12 rounded-full transition-all duration-300 border-0 ${
            location === "/" ? "bg-pink-accent text-white" : "bg-transparent text-white hover:bg-pink-accent"
          }`}
        >
          <Home className="w-5 h-5" />
        </Button>
        <Button
          onClick={() => setLocation("/mood-selector")}
          size="icon"
          className={`w-12 h-12 rounded-full transition-all duration-300 border-0 ${
            location === "/mood-selector" ? "bg-pink-accent text-white" : "bg-transparent text-white hover:bg-pink-accent"
          }`}
        >
          <Heart className="w-5 h-5" />
        </Button>
        <Button
          onClick={() => setLocation("/journal")}
          size="icon"
          className={`w-12 h-12 rounded-full transition-all duration-300 border-0 ${
            location === "/journal" ? "bg-pink-accent text-white" : "bg-transparent text-white hover:bg-pink-accent"
          }`}
        >
          <Book className="w-5 h-5" />
        </Button>
        <Button
          onClick={() => setLocation("/results")}
          size="icon"
          className={`w-12 h-12 rounded-full transition-all duration-300 border-0 ${
            location === "/results" ? "bg-pink-accent text-white" : "bg-transparent text-white hover:bg-pink-accent"
          }`}
        >
          <Sparkles className="w-5 h-5" />
        </Button>
      </div>
    </nav>
  );
}
