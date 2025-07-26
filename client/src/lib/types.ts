export interface MoodSuggestion {
  emoji: string;
  mood: string;
  description: string;
}

export interface GenerationResult {
  sessionId: string;
  outfit: {
    styleName: string;
    description: string;
    colorPalette: string[];
    instagramCaption: string;
    imagePrompt: string;
    image?: { url: string };
  };
  moodboard: {
    theme: string;
    elements: string[];
    colorScheme: string[];
    aestheticTags: string[];
  };
  poem: string;
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
