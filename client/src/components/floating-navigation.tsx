import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Home, Heart, Book, Sparkles } from "lucide-react";

export default function FloatingNavigation() {
  const [location, setLocation] = useLocation();

  if (location === "/") return null;

  // Cosmic sparkle bubbles for premium effect
  const sparkles = [
    { left: '10%', top: '-18px', delay: '0s', color: '#fbc2eb' },
    { left: '90%', top: '8px', delay: '1.2s', color: '#b993d6' },
    { left: '50%', top: '-28px', delay: '2.1s', color: '#a78bfa' },
    { left: '20%', top: '38px', delay: '2.7s', color: '#ede7f6' },
    { left: '80%', top: '38px', delay: '1.7s', color: '#ffe0b2' },
  ];

  return (
    <nav className="fixed bottom-6 inset-x-0 flex justify-center z-50 animate-float">
      <div
        className="flex space-x-4 glass-premium rounded-full p-3 shadow-2xl"
        style={{
          background: 'linear-gradient(90deg, #fbc2eb 0%, #b993d6 60%, #a78bfa 100%)',
          boxShadow: '0 8px 32px #b993d6, 0 0 64px #a78bfa',
          border: '2px solid rgba(185,147,214,0.18)',
          position: 'relative',
        }}
      >
        {/* Sparkle bubbles */}
        {sparkles.map((s, i) => (
          <div
            key={i}
            className="sparkle"
            style={{
              left: s.left,
              top: s.top,
              background: s.color,
              animationDelay: s.delay,
              position: 'absolute',
              width: '7px',
              height: '7px',
              zIndex: 0,
              boxShadow: `0 0 16px 2px ${s.color}`,
              opacity: 0.7,
            }}
          />
        ))}
        {/* Premium nav buttons */}
        <Button
          onClick={() => setLocation("/")}
          size="icon"
          className={`interactive-button w-14 h-14 rounded-full border-0 shadow-lg transition-all duration-300 jersey-10-regular text-2xl ${
            location === "/" ? "bg-pastel-pink text-[#7b2ff2]" : "bg-transparent text-purple-light hover:bg-pastel-pink hover:text-[#7b2ff2]"
          }`}
          style={{
            boxShadow: location === "/" ? '0 0 24px #fbc2eb, 0 0 32px #b993d6' : '0 2px 8px #b993d6',
            backdropFilter: 'blur(12px) saturate(120%)',
            border: location === "/" ? '2px solid #fbc2eb' : '2px solid #e5dcf2',
          }}
        >
          <Home className="w-7 h-7" />
        </Button>
        <Button
          onClick={() => setLocation("/mood-selector")}
          size="icon"
          className={`interactive-button w-14 h-14 rounded-full border-0 shadow-lg transition-all duration-300 jersey-10-regular text-2xl ${
            location === "/mood-selector" ? "bg-pastel-lavender text-[#7b2ff2]" : "bg-transparent text-purple-light hover:bg-pastel-lavender hover:text-[#7b2ff2]"
          }`}
          style={{
            boxShadow: location === "/mood-selector" ? '0 0 24px #b993d6, 0 0 32px #a78bfa' : '0 2px 8px #b993d6',
            backdropFilter: 'blur(12px) saturate(120%)',
            border: location === "/mood-selector" ? '2px solid #b993d6' : '2px solid #e5dcf2',
          }}
        >
          <Heart className="w-7 h-7" />
        </Button>
        <Button
          onClick={() => setLocation("/journal")}
          size="icon"
          className={`interactive-button w-14 h-14 rounded-full border-0 shadow-lg transition-all duration-300 jersey-10-regular text-2xl ${
            location === "/journal" ? "bg-pastel-yellow text-[#7b2ff2]" : "bg-transparent text-purple-light hover:bg-pastel-yellow hover:text-[#7b2ff2]"
          }`}
          style={{
            boxShadow: location === "/journal" ? '0 0 24px #ffe082, 0 0 32px #b993d6' : '0 2px 8px #b993d6',
            backdropFilter: 'blur(12px) saturate(120%)',
            border: location === "/journal" ? '2px solid #ffe082' : '2px solid #e5dcf2',
          }}
        >
          <Book className="w-7 h-7" />
        </Button>
        <Button
          onClick={() => setLocation("/results")}
          size="icon"
          className={`interactive-button w-14 h-14 rounded-full border-0 shadow-lg transition-all duration-300 jersey-10-regular text-2xl ${
            location === "/results" ? "bg-pastel-blue text-[#7b2ff2]" : "bg-transparent text-purple-light hover:bg-pastel-blue hover:text-[#7b2ff2]"
          }`}
          style={{
            boxShadow: location === "/results" ? '0 0 24px #90caf9, 0 0 32px #b993d6' : '0 2px 8px #b993d6',
            backdropFilter: 'blur(12px) saturate(120%)',
            border: location === "/results" ? '2px solid #90caf9' : '2px solid #e5dcf2',
          }}
        >
          <Sparkles className="w-7 h-7" />
        </Button>
      </div>
    </nav>
  );
}
