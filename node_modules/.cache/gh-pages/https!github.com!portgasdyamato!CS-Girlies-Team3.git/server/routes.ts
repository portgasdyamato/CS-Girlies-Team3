import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMoodSessionSchema } from "@shared/schema";
import { generateOutfit, generateMoodboard, generatePoem, generatePlaylist, generateOutfitImage } from "./services/openai";
import { setupAuth, isAuthenticated } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  await setupAuth(app);
  
  // Generate complete mood aesthetic (protected route)
  app.post("/api/generate-aesthetic", async (req, res) => {
    try {
      const { mood, moodEmoji, journalEntry } = insertMoodSessionSchema.parse(req.body);
      const userId = req.isAuthenticated() ? (req.user as any)?.id : null;

      // Generate all content in parallel
      const [outfit, moodboard, poem, playlist] = await Promise.all([
        generateOutfit(mood, journalEntry),
        generateMoodboard(mood, journalEntry),
        generatePoem(mood, journalEntry),
        generatePlaylist(mood, journalEntry)
      ]);

      // Generate outfit image
      let outfitImage = null;
      try {
        outfitImage = await generateOutfitImage(outfit.imagePrompt);
      } catch (imageError) {
        console.error("Failed to generate outfit image:", imageError);
      }

      // Save the session
      const session = await storage.createMoodSession({
        userId,
        mood,
        moodEmoji,
        journalEntry,
        generatedOutfit: { ...outfit, image: outfitImage },
        generatedMoodboard: moodboard,
        generatedPoem: poem,
        generatedPlaylist: playlist
      });

      res.json({
        sessionId: session.id,
        outfit: { ...outfit, image: outfitImage },
        moodboard,
        poem,
        playlist
      });
    } catch (error) {
      console.error("Generation error:", error);
      res.status(500).json({ 
        message: "Failed to generate aesthetic content. Please check your OpenAI API key and try again.",
        error: typeof error === 'object' && error !== null && 'message' in error ? (error as any).message : String(error)
      });
    }
  });

  // Get mood session
  app.get("/api/sessions/:id", async (req, res) => {
    try {
      const session = await storage.getMoodSession(req.params.id);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      res.json(session);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch session", error: typeof error === 'object' && error !== null && 'message' in error ? (error as any).message : String(error) });
    }
  });

  // Get user's mood sessions (protected route)
  app.get("/api/my-sessions", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.id;
      const sessions = await storage.getMoodSessionsByUser(userId);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sessions", error: typeof error === 'object' && error !== null && 'message' in error ? (error as any).message : String(error) });
    }
  });

  // Get mood suggestions
  app.get("/api/mood-suggestions", async (req, res) => {
    const suggestions = [
      { emoji: "😊", mood: "happy", description: "Bright and cheerful" },
      { emoji: "😌", mood: "dreamy", description: "Soft and ethereal" },
      { emoji: "😎", mood: "baddie", description: "Confident and fierce" },
      { emoji: "🥺", mood: "soft", description: "Gentle and tender" },
      { emoji: "🌙", mood: "mysterious", description: "Dark and enigmatic" },
      { emoji: "💕", mood: "romantic", description: "Love and sweetness" },
      { emoji: "⚡", mood: "energetic", description: "Bold and vibrant" },
      { emoji: "🌸", mood: "peaceful", description: "Calm and serene" },
      { emoji: "🔥", mood: "fierce", description: "Strong and powerful" },
      { emoji: "🌻", mood: "vintage", description: "Nostalgic and classic" },
      { emoji: "✨", mood: "ethereal", description: "Magical and otherworldly" },
      { emoji: "🍂", mood: "cozy", description: "Warm and comfortable" }
    ];
    res.json(suggestions);
  });

  const httpServer = createServer(app);
  return httpServer;
}
