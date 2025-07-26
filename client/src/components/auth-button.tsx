import { Button } from "@/components/ui/button";
import { LogIn, LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface AuthButtonProps {
  showProfile?: boolean;
}

export default function AuthButton({ showProfile = false }: AuthButtonProps) {
  const { user, isAuthenticated, isLoading } = useAuth();

  const handleLogin = () => {
    window.location.href = "/api/auth/google";
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (isLoading) {
    return (
      <Button disabled className="glass-card text-white border-0">
        Loading...
      </Button>
    );
  }

  if (!isAuthenticated) {
    return (
      <Button 
        onClick={handleLogin}
        className="pink-gradient text-white font-semibold rounded-full hover-scale transition-all duration-300 shadow-xl border-0"
      >
        <LogIn className="w-4 h-4 mr-2" />
        Sign in with Google
      </Button>
    );
  }

  if (showProfile) {
    return (
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 glass-card rounded-full px-4 py-2">
          {user?.profileImageUrl ? (
            <img 
              src={user.profileImageUrl} 
              alt="Profile" 
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <User className="w-6 h-6 text-pink-accent" />
          )}
          <span className="text-white font-medium">
            {user?.firstName || user?.email?.split('@')[0] || 'User'}
          </span>
        </div>
        <Button 
          onClick={handleLogout}
          size="icon"
          className="glass-card rounded-full text-pink-accent hover-scale border-0"
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <Button 
      onClick={handleLogout}
      className="glass-card text-white rounded-full hover-scale transition-all duration-300 border-0"
    >
      <LogOut className="w-4 h-4 mr-2" />
      Sign Out
    </Button>
  );
}