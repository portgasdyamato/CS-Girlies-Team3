import { Button } from "@/components/ui/button";
import { Music } from "lucide-react";
import { FaSpotify } from "react-icons/fa";

interface PlaylistCardProps {
  playlist: {
    name: string;
    description: string;
    tracks: Array<{
      artist: string;
      song: string;
      duration: string;
    }>;
  };
}

export default function PlaylistCard({ playlist }: PlaylistCardProps) {
  const handleSpotifyOpen = () => {
    // In a real implementation, this would open Spotify with the playlist
    window.open("https://open.spotify.com", "_blank");
  };

  const totalDuration = playlist.tracks.reduce((total, track) => {
    const [minutes, seconds] = track.duration.split(':').map(Number);
    return total + minutes + (seconds / 60);
  }, 0);

  const formatDuration = (minutes: number) => {
    const mins = Math.floor(minutes);
    return `${mins} min`;
  };

  return (
    <div className="glass-card rounded-3xl p-6 hover-scale pulse-glow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-semibold text-white">Your Playlist 🎵</h3>
        <Button 
          onClick={handleSpotifyOpen}
          size="icon"
          className="glass-card rounded-full text-pink-accent hover-scale border-0"
        >
          <FaSpotify className="w-5 h-5" />
        </Button>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-16 h-16 glass-card rounded-lg flex items-center justify-center">
            <Music className="w-8 h-8 text-pink-accent" />
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white">{playlist.name}</h4>
            <p className="text-sm text-purple-light">
              {playlist.tracks.length} songs • {formatDuration(totalDuration)}
            </p>
          </div>
        </div>
        
        {/* Sample Track List */}
        <div className="space-y-2 text-sm max-h-48 overflow-y-auto">
          {playlist.tracks.slice(0, 6).map((track, index) => (
            <div key={index} className="flex justify-between text-cream hover:text-white transition-colors">
              <span className="truncate mr-2">{track.artist} - {track.song}</span>
              <span className="text-purple-light flex-shrink-0">{track.duration}</span>
            </div>
          ))}
          {playlist.tracks.length > 6 && (
            <div className="text-purple-light">
              + {playlist.tracks.length - 6} more tracks...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
