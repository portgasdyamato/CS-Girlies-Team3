import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Sparkles, Palette, Music } from "lucide-react";
import AuthButton from "@/components/auth-button";
import { useAuth } from "@/hooks/useAuth";

export default function LandingPage() {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();

  return (
    <section className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center space-y-8 max-w-4xl mx-auto">
        {/* Floating Logo */}
        <div className="floating mb-8">
          <div className="w-32 h-32 mx-auto glass-card rounded-full flex items-center justify-center pulse-glow">
            <Sparkles className="w-16 h-16 text-pink-light" />
          </div>
        </div>
        
        {/* Animated Title */}
        <div className="space-y-4">
          <h1 className="text-7xl md:text-8xl font-bold text-white text-glow tracking-wider">
            Muse<span className="text-pink-light">Mood</span>
          </h1>
          <p className="text-2xl md:text-3xl text-cream font-light tracking-wide">
            Your AI-Powered Aesthetic Generator ✨
          </p>
          <p className="text-lg text-purple-light max-w-2xl mx-auto leading-relaxed">
            Transform your emotions into a complete sensory experience with AI-generated outfits, moodboards, poems, and playlists
          </p>
        </div>
        
        {/* CTA and Auth Buttons */}
        <div className="pt-8 space-y-4">
          <div>
            <Button 
              onClick={() => setLocation("/mood-selector")}
              className="px-12 py-4 pink-gradient text-white font-semibold text-xl rounded-full hover-scale transition-all duration-300 shadow-2xl border-0"
              size="lg"
            >
              <span className="mr-3">💖</span>
              Start Your Mood Journey
            </Button>
          </div>
          <div className="flex justify-center">
            <AuthButton />
          </div>
          {isAuthenticated && (
            <div className="flex justify-center">
              <Button 
                onClick={() => setLocation("/profile")}
                variant="outline"
                className="glass-card text-white border-lavender hover:border-pink-accent"
              >
                View My Profile
              </Button>
            </div>
          )}
        </div>
        
        {/* Floating Elements */}
        <div className="floating-delayed absolute top-20 left-20 hidden md:block">
          <div className="glass-card w-20 h-20 rounded-2xl flex items-center justify-center">
            <Palette className="w-8 h-8 text-lavender" />
          </div>
        </div>
        <div className="floating absolute bottom-20 right-20 hidden md:block">
          <div className="glass-card w-24 h-24 rounded-3xl flex items-center justify-center">
            <Music className="w-10 h-10 text-pink-accent" />
          </div>
        </div>
      </div>
    </section>
  );
}
