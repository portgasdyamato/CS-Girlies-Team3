import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Calendar, Heart, Sparkles } from "lucide-react";
import AuthButton from "@/components/auth-button";
import { MoodSession } from "@shared/schema";

type User = {
  profileImageUrl?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  createdAt?: string | number;
};

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading } = useAuth() as { user?: User; isAuthenticated: boolean; isLoading: boolean };
  const [, setLocation] = useLocation();

  const { data: moodSessions = [], isLoading: sessionsLoading } = useQuery<MoodSession[]>({
    queryKey: ["/api/my-sessions"],
    enabled: isAuthenticated,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="glass-card rounded-3xl p-8 text-center">
          <div className="animate-pulse">
            <Sparkles className="w-16 h-16 text-pink-accent mx-auto mb-4" />
            <p className="text-purple-light text-lg">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center glass-card rounded-3xl p-8 max-w-md">
          <Heart className="w-16 h-16 text-pink-accent mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-purple-deep mb-4">Sign in to MuseMood</h2>
          <p className="text-purple-deep mb-6">
            Create an account to save your mood journeys, track your aesthetic evolution, and access your personalized content library.
          </p>
          <AuthButton />
          <div className="mt-4">
            <Button 
              onClick={() => setLocation("/")}
              variant="outline"
              className="glass-card text-purple-light border-lavender hover:border-pink-accent"
            >
              Continue as Guest
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="glass-card rounded-3xl p-8 mb-8 pulse-glow">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              {user?.profileImageUrl ? (
                <img 
                  src={user.profileImageUrl} 
                  alt="Profile" 
                  className="w-20 h-20 rounded-full border-4 border-pink-accent"
                />
              ) : (
                <div className="w-20 h-20 rounded-full glass-card flex items-center justify-center">
                  <Heart className="w-10 h-10 text-pink-accent" />
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold text-purple-deep">
                  {user?.firstName && user?.lastName 
                    ? `${user.firstName} ${user.lastName}` 
                    : user?.firstName || user?.email?.split('@')[0] || 'MuseMood User'
                  }
                </h1>
                <p className="text-purple-light">{user?.email}</p>
                <p className="text-sm text-purple-deep">
                  Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                </p>
              </div>
            </div>
            <AuthButton showProfile={false} />
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-accent">{moodSessions.length}</div>
              <div className="text-sm text-purple-deep">Mood Journeys</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-accent">
                {new Set(moodSessions.map(s => s.mood)).size}
              </div>
              <div className="text-sm text-purple-deep">Unique Moods</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-accent">
                {moodSessions.filter(s => s.createdAt && 
                  new Date(s.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
                ).length}
              </div>
              <div className="text-sm text-purple-deep">This Week</div>
            </div>
          </div>
        </div>

        {/* Recent Mood Journeys */}
        <div className="glass-card rounded-3xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-purple-deep">Your Mood History</h2>
            <Button 
              onClick={() => setLocation("/mood-selector")}
              className="pink-gradient text-purple-deep rounded-full border-0"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Create New Mood
            </Button>
          </div>

          {sessionsLoading ? (
            <div className="text-center py-8">
              <div className="animate-pulse">
                <Calendar className="w-12 h-12 text-pink-accent mx-auto mb-4" />
                <p className="text-purple-deep">Loading your mood journeys...</p>
              </div>
            </div>
          ) : moodSessions.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-purple-light mx-auto mb-4" />
              <p className="text-purple-deep mb-4">No mood journeys yet</p>
              <p className="text-purple-light text-sm">
                Start your first mood journey to see your aesthetic evolution!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {moodSessions.slice(0, 9).map((session) => (
                <div key={session.id} className="glass-card rounded-2xl p-4 hover-scale cursor-pointer">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{session.moodEmoji || '💫'}</span>
                    <span className="text-xs text-purple-light">
                      {new Date(session.createdAt!).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-purple-light font-medium mb-2 capitalize">{session.mood}</h3>
                  <p className="text-purple-deep text-sm line-clamp-2">
                    {session.journalEntry}
                  </p>
                  <Button 
                    onClick={() => setLocation(`/sessions/${session.id}`)}
                    size="sm"
                    className="w-full mt-3 glass-card text-pink-accent border-0"
                  >
                    View Results
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}