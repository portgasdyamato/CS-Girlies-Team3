import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Sparkles, Palette, Music } from "lucide-react";
import AuthButton from "@/components/auth-button";
import { useAuth } from "@/hooks/useAuth";

export default function LandingPage() {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();

  return (
    <section className="min-h-screen flex items-center justify-center p-6 gradient-bg bitcount-grid-double-uniquifier">
      <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center bitcount-grid-double-uniquifier">
        {/* Floating Icons */}
        <div className="absolute left-0 top-1/3">
          <div className="w-20 h-20 glass-card rounded-2xl flex items-center justify-center shadow-xl border-pink-accent bg-[rgba(40,0,60,0.85)]">
            <Palette className="w-10 h-10" style={{color: '#b993d6'}} />
          </div>
        </div>
        <div className="absolute right-0 top-1/3">
          <div className="w-20 h-20 glass-card rounded-2xl flex items-center justify-center shadow-xl border-pink-accent bg-[rgba(40,0,60,0.85)]">
            <Music className="w-10 h-10" style={{color: '#b993d6'}} />
          </div>
        </div>
        {/* Floating Logo */}
        <div className="floating mb-8">
          <div className="w-32 h-32 glass-card rounded-full flex items-center justify-center pulse-glow shadow-2xl border-pink-accent bg-[rgba(40,0,60,0.85)]">
            <Sparkles className="w-16 h-16" style={{color: '#fbc2eb'}} />
          </div>
        </div>
        {/* Animated Title */}
        <div className="space-y-4 text-center">
          <h1 className="text-7xl md:text-8xl font-bold text-purple-300 text-glow tracking-wider bitcount-grid-double-uniquifier" style={{textShadow: '0 2px 8px #3a185c'}}>
            Muse<span style={{color: '#f7b2e6'}}>Mood</span>
          </h1>
          <p className="text-2xl md:text-3xl font-light tracking-wide text-purple-light bitcount-grid-double-uniquifier" style={{color: '#e6e0f6', textShadow: '0 1px 4px #3a185c'}}>
            Your AI-Powered Aesthetic Generator ✨
          </p>
          <p className="text-lg max-w-2xl mx-auto  text-purple-300 leading-relaxed text-pink-accent bitcount-grid-double-uniquifier" style={{textShadow: '0 1px 4px #3a185c'}}>
            Transform your emotions into a complete sensory experience with AI-generated outfits, moodboards, poems, and playlists
          </p>
        </div>
        {/* CTA and Auth Buttons */}
        <div className="pt-8 space-y-4 w-full flex flex-col items-center">
          <Button 
            onClick={() => setLocation("/mood-selector")}
            className="px-12 py-4 btn-purple font-semibold text-xl rounded-full hover-scale transition-all duration-300 shadow-2xl border-0"
            size="lg"
          >
            <span className="mr-3">💖</span>
            Start Your Mood Journey
          </Button>
          <div className="flex justify-center w-full">
            <AuthButton />
          </div>
          {isAuthenticated && (
            <div className="flex justify-center w-full">
              <Button 
                onClick={() => setLocation("/profile")}
                variant="outline"
                className="glass-card text-purple-light border-lavender hover:border-pink-accent"
              >
                View My Profile
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
