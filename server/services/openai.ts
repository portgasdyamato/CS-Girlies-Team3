import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "sk-test"
});

export interface OutfitGeneration {
  styleName: string;
  description: string;
  colorPalette: string[];
  instagramCaption: string;
  imagePrompt: string;
}

export interface MoodboardGeneration {
  theme: string;
  elements: string[];
  colorScheme: string[];
  aestheticTags: string[];
}

export interface PlaylistGeneration {
  name: string;
  description: string;
  tracks: Array<{
    artist: string;
    song: string;
    duration: string;
  }>;
}

export async function generateOutfit(mood: string, journalEntry: string): Promise<OutfitGeneration> {
  try {
    const prompt = `Based on the mood "${mood}" and this journal entry: "${journalEntry}", create a fashion outfit that matches this aesthetic. 

    Respond with JSON in this exact format:
    {
      "styleName": "aesthetic name for the outfit",
      "description": "detailed description of the outfit pieces",
      "colorPalette": ["#hex1", "#hex2", "#hex3", "#hex4"],
      "instagramCaption": "trendy caption with emojis",
      "imagePrompt": "detailed prompt for AI image generation of the outfit"
    }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a fashion stylist AI that creates trendy, aesthetic outfits based on moods and emotions. Focus on Gen Z and millennial fashion trends."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content!);
  } catch (error) {
    throw new Error("Failed to generate outfit: " + error.message);
  }
}

export async function generateMoodboard(mood: string, journalEntry: string): Promise<MoodboardGeneration> {
  try {
    const prompt = `Based on the mood "${mood}" and this journal entry: "${journalEntry}", create a visual moodboard concept.

    Respond with JSON in this exact format:
    {
      "theme": "overall theme name",
      "elements": ["element1", "element2", "element3", "element4", "element5", "element6"],
      "colorScheme": ["#hex1", "#hex2", "#hex3", "#hex4"],
      "aestheticTags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
    }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a visual designer AI that creates aesthetic moodboards. Focus on dreamy, artistic, and trendy visual elements."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content!);
  } catch (error) {
    throw new Error("Failed to generate moodboard: " + error.message);
  }
}

export async function generatePoem(mood: string, journalEntry: string): Promise<string> {
  try {
    const prompt = `Based on the mood "${mood}" and this journal entry: "${journalEntry}", write a beautiful, dreamy poem that captures the essence of these emotions. Make it romantic, aesthetic, and meaningful. The poem should be 2-3 stanzas with a poetic title.

    Format the response as:
    Title: [poem title]
    
    [poem content with line breaks]`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a romantic poet AI that writes beautiful, aesthetic poetry. Focus on emotions, nature, dreams, and beauty. Write in a style that resonates with Gen Z aesthetics."
        },
        {
          role: "user",
          content: prompt
        }
      ],
    });

    return response.choices[0].message.content!;
  } catch (error) {
    throw new Error("Failed to generate poem: " + error.message);
  }
}

export async function generatePlaylist(mood: string, journalEntry: string): Promise<PlaylistGeneration> {
  try {
    const prompt = `Based on the mood "${mood}" and this journal entry: "${journalEntry}", create a curated music playlist that matches this vibe.

    Respond with JSON in this exact format:
    {
      "name": "playlist name with emojis",
      "description": "short description of the playlist vibe",
      "tracks": [
        {"artist": "Artist Name", "song": "Song Title", "duration": "3:25"},
        {"artist": "Artist Name", "song": "Song Title", "duration": "4:12"}
      ]
    }
    
    Include 8-12 real songs that match the mood. Focus on indie, pop, alternative, and dreamy genres popular with Gen Z.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a music curator AI that creates aesthetic playlists. Focus on indie, alternative, pop, and dreamy music that matches emotional aesthetics."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content!);
  } catch (error) {
    throw new Error("Failed to generate playlist: " + error.message);
  }
}

export async function generateOutfitImage(imagePrompt: string): Promise<{ url: string }> {
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Fashion outfit photo: ${imagePrompt}. Style: aesthetic, dreamy, high-quality fashion photography, soft lighting, trendy Gen Z fashion`,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    return { url: response.data[0].url! };
  } catch (error) {
    throw new Error("Failed to generate outfit image: " + error.message);
  }
}
