import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Sparkles, Palette, Music, Heart, Zap, Star, Crown, Gem, ArrowRight, Play } from "lucide-react";
import AuthButton from "@/components/auth-button";
import { useAuth } from "@/hooks/useAuth";

export default function LandingPage() {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Premium background with subtle gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,182,193,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_80%,rgba(147,51,234,0.1),transparent_50%)]"></div>
      </div>

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px]"></div>

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-8 py-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-600 rounded-xl flex items-center justify-center">
            <Gem className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            MuseMood
          </span>
        </div>
        <AuthButton />
      </nav>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-20 max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-sm text-gray-300 mb-8">
              <Sparkles className="w-4 h-4 mr-2 text-pink-400" />
              AI-Powered Aesthetic Generator
            </div>
          </div>

          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black mb-8 leading-tight">
            <span className="bg-gradient-to-r from-white via-pink-200 to-purple-200 bg-clip-text text-transparent">
              Create Your
            </span>
            <br />
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              Perfect Vibe
            </span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            Discover your unique aesthetic through AI-curated fashion, mood boards, poetry, and playlists. 
            <span className="text-white font-medium"> Elevate your style, express your soul.</span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
            <Button
              onClick={() => setLocation("/mood-selector")}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-12 py-4 text-lg font-semibold rounded-2xl shadow-2xl hover:shadow-pink-500/25 transition-all duration-300 hover:scale-105 border-0 group"
            >
              <Play className="w-5 h-5 mr-3 group-hover:translate-x-1 transition-transform duration-300" />
              Start Creating
              <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
            
            <Button
              variant="outline"
              className="border-2 border-white/20 text-white hover:bg-white/5 hover:border-white/30 px-8 py-4 text-lg font-medium rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-105"
            >
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Premium Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20 max-w-7xl w-full">
          {[
            { 
              icon: Palette, 
              title: "Style Curation", 
              desc: "AI analyzes your preferences to curate the perfect wardrobe pieces that match your unique aesthetic.",
              gradient: "from-pink-500/20 to-rose-500/20",
              iconGradient: "from-pink-400 to-rose-500"
            },
            { 
              icon: Heart, 
              title: "Mood Boards", 
              desc: "Stunning visual collections that capture and amplify your current emotional and aesthetic state.",
              gradient: "from-purple-500/20 to-violet-500/20",
              iconGradient: "from-purple-400 to-violet-500"
            },
            { 
              icon: Star, 
              title: "Poetry & Words", 
              desc: "Personalized verses and quotes that resonate with your inner thoughts and creative expression.",
              gradient: "from-blue-500/20 to-cyan-500/20",
              iconGradient: "from-blue-400 to-cyan-500"
            },
            { 
              icon: Music, 
              title: "Curated Playlists", 
              desc: "Carefully selected tracks that perfectly complement your mood and enhance your daily experiences.",
              gradient: "from-indigo-500/20 to-purple-500/20",
              iconGradient: "from-indigo-400 to-purple-500"
            },
          ].map((feature, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${feature.gradient} backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl group cursor-pointer`}
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${feature.iconGradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-pink-200 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed text-sm group-hover:text-gray-300 transition-colors">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20 max-w-4xl w-full">
          {[
            { number: "50K+", label: "Curated Looks" },
            { number: "25K+", label: "Happy Users" },
            { number: "100K+", label: "Mood Boards" },
            { number: "1M+", label: "Song Matches" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
                {stat.number}
              </div>
              <div className="text-gray-400 text-sm font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonial */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-12 border border-white/10">
            <div className="flex justify-center mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
              ))}
            </div>
            <blockquote className="text-2xl text-white mb-6 font-light italic leading-relaxed">
              "MuseMood completely transformed how I express myself. The AI understands my vibe better than I do sometimes."
            </blockquote>
            <div className="flex items-center justify-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <div className="text-white font-semibold">Sarah Chen</div>
                <div className="text-gray-400 text-sm">Creative Director</div>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to discover your aesthetic?
          </h2>
          <p className="text-gray-400 mb-8 text-lg">
            Join thousands who've found their perfect style expression
          </p>
          <Button
            onClick={() => setLocation("/mood-selector")}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-16 py-6 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-pink-500/30 transition-all duration-300 hover:scale-110 border-0 group"
          >
            <Zap className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
            Begin Your Journey
          </Button>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>
    </div>
  );
}
