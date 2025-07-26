var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import dotenv from "dotenv";
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  insertMoodSessionSchema: () => insertMoodSessionSchema,
  insertUserSchema: () => insertUserSchema,
  moodSessions: () => moodSessions,
  sessions: () => sessions,
  users: () => users
});
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull()
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  googleId: varchar("google_id").unique(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var moodSessions = pgTable("mood_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  mood: text("mood").notNull(),
  moodEmoji: text("mood_emoji"),
  journalEntry: text("journal_entry").notNull(),
  generatedOutfit: jsonb("generated_outfit"),
  generatedMoodboard: jsonb("generated_moodboard"),
  generatedPoem: text("generated_poem"),
  generatedPlaylist: jsonb("generated_playlist"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var insertUserSchema = createInsertSchema(users).pick({
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
  googleId: true
});
var insertMoodSessionSchema = createInsertSchema(moodSessions).pick({
  mood: true,
  moodEmoji: true,
  journalEntry: true
});

// server/db.ts
import "dotenv/config";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq } from "drizzle-orm";
var DatabaseStorage = class {
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || void 0;
  }
  async getUserByEmail(email) {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || void 0;
  }
  async upsertUser(userData) {
    const [user] = await db.insert(users).values(userData).onConflictDoUpdate({
      target: users.googleId,
      set: {
        ...userData,
        updatedAt: /* @__PURE__ */ new Date()
      }
    }).returning();
    return user;
  }
  async createMoodSession(sessionData) {
    const [session2] = await db.insert(moodSessions).values({
      userId: sessionData.userId || null,
      mood: sessionData.mood,
      moodEmoji: sessionData.moodEmoji || null,
      journalEntry: sessionData.journalEntry,
      generatedOutfit: sessionData.generatedOutfit || null,
      generatedMoodboard: sessionData.generatedMoodboard || null,
      generatedPoem: sessionData.generatedPoem || null,
      generatedPlaylist: sessionData.generatedPlaylist || null
    }).returning();
    return session2;
  }
  async getMoodSession(id) {
    const [session2] = await db.select().from(moodSessions).where(eq(moodSessions.id, id));
    return session2 || void 0;
  }
  async getMoodSessionsByUser(userId) {
    return await db.select().from(moodSessions).where(eq(moodSessions.userId, userId));
  }
  async updateMoodSession(id, updates) {
    const [session2] = await db.update(moodSessions).set(updates).where(eq(moodSessions.id, id)).returning();
    if (!session2) {
      throw new Error("Session not found");
    }
    return session2;
  }
};
var storage = new DatabaseStorage();

// server/services/openai.ts
import OpenAI from "openai";
var openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "sk-test"
});
async function generateOutfit(mood, journalEntry) {
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
      response_format: { type: "json_object" }
    });
    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    throw new Error("Failed to generate outfit: " + error.message);
  }
}
async function generateMoodboard(mood, journalEntry) {
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
      response_format: { type: "json_object" }
    });
    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    throw new Error("Failed to generate moodboard: " + error.message);
  }
}
async function generatePoem(mood, journalEntry) {
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
      ]
    });
    return response.choices[0].message.content;
  } catch (error) {
    throw new Error("Failed to generate poem: " + error.message);
  }
}
async function generatePlaylist(mood, journalEntry) {
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
      response_format: { type: "json_object" }
    });
    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    throw new Error("Failed to generate playlist: " + error.message);
  }
}
async function generateOutfitImage(imagePrompt) {
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Fashion outfit photo: ${imagePrompt}. Style: aesthetic, dreamy, high-quality fashion photography, soft lighting, trendy Gen Z fashion`,
      n: 1,
      size: "1024x1024",
      quality: "standard"
    });
    return { url: response.data[0].url };
  } catch (error) {
    throw new Error("Failed to generate outfit image: " + error.message);
  }
}

// server/auth.ts
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import session from "express-session";
import connectPg from "connect-pg-simple";
function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1e3;
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions"
  });
  return session({
    secret: process.env.SESSION_SECRET || "musemood-secret-key-for-dev",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: sessionTtl
    }
  });
}
async function setupAuth(app2) {
  app2.use(getSession());
  app2.use(passport.initialize());
  app2.use(passport.session());
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: "/api/auth/google/callback"
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const userData = {
              googleId: profile.id,
              email: profile.emails?.[0]?.value || null,
              firstName: profile.name?.givenName || null,
              lastName: profile.name?.familyName || null,
              profileImageUrl: profile.photos?.[0]?.value || null
            };
            const user = await storage.upsertUser(userData);
            return done(null, user);
          } catch (error) {
            return done(error);
          }
        }
      )
    );
  }
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
  app2.get("/api/auth/google", passport.authenticate("google", {
    scope: ["profile", "email"]
  }));
  app2.get(
    "/api/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    (req, res) => {
      res.redirect("/");
    }
  );
  app2.get("/api/auth/user", (req, res) => {
    if (req.isAuthenticated()) {
      res.json(req.user);
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  });
  app2.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });
}
var isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Authentication required" });
};

// server/routes.ts
async function registerRoutes(app2) {
  await setupAuth(app2);
  app2.post("/api/generate-aesthetic", async (req, res) => {
    try {
      const { mood, moodEmoji, journalEntry } = insertMoodSessionSchema.parse(req.body);
      const userId = req.isAuthenticated() ? req.user?.id : null;
      const [outfit, moodboard, poem, playlist] = await Promise.all([
        generateOutfit(mood, journalEntry),
        generateMoodboard(mood, journalEntry),
        generatePoem(mood, journalEntry),
        generatePlaylist(mood, journalEntry)
      ]);
      let outfitImage = null;
      try {
        outfitImage = await generateOutfitImage(outfit.imagePrompt);
      } catch (imageError) {
        console.error("Failed to generate outfit image:", imageError);
      }
      const session2 = await storage.createMoodSession({
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
        sessionId: session2.id,
        outfit: { ...outfit, image: outfitImage },
        moodboard,
        poem,
        playlist
      });
    } catch (error) {
      console.error("Generation error:", error);
      res.status(500).json({
        message: "Failed to generate aesthetic content. Please check your OpenAI API key and try again.",
        error: typeof error === "object" && error !== null && "message" in error ? error.message : String(error)
      });
    }
  });
  app2.get("/api/sessions/:id", async (req, res) => {
    try {
      const session2 = await storage.getMoodSession(req.params.id);
      if (!session2) {
        return res.status(404).json({ message: "Session not found" });
      }
      res.json(session2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch session", error: typeof error === "object" && error !== null && "message" in error ? error.message : String(error) });
    }
  });
  app2.get("/api/my-sessions", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.id;
      const sessions2 = await storage.getMoodSessionsByUser(userId);
      res.json(sessions2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sessions", error: typeof error === "object" && error !== null && "message" in error ? error.message : String(error) });
    }
  });
  app2.get("/api/mood-suggestions", async (req, res) => {
    const suggestions = [
      { emoji: "\u{1F60A}", mood: "happy", description: "Bright and cheerful" },
      { emoji: "\u{1F60C}", mood: "dreamy", description: "Soft and ethereal" },
      { emoji: "\u{1F60E}", mood: "baddie", description: "Confident and fierce" },
      { emoji: "\u{1F97A}", mood: "soft", description: "Gentle and tender" },
      { emoji: "\u{1F319}", mood: "mysterious", description: "Dark and enigmatic" },
      { emoji: "\u{1F495}", mood: "romantic", description: "Love and sweetness" },
      { emoji: "\u26A1", mood: "energetic", description: "Bold and vibrant" },
      { emoji: "\u{1F338}", mood: "peaceful", description: "Calm and serene" },
      { emoji: "\u{1F525}", mood: "fierce", description: "Strong and powerful" },
      { emoji: "\u{1F33B}", mood: "vintage", description: "Nostalgic and classic" },
      { emoji: "\u2728", mood: "ethereal", description: "Magical and otherworldly" },
      { emoji: "\u{1F342}", mood: "cozy", description: "Warm and comfortable" }
    ];
    res.json(suggestions);
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
var vite_config_default = defineConfig({
  plugins: [
    react()
    // ...existing code...
  ],
  resolve: {
    alias: {
      "@": path.resolve(fileURLToPath(import.meta.url), "../client/src"),
      "@shared": path.resolve(fileURLToPath(import.meta.url), "../shared"),
      "@assets": path.resolve(fileURLToPath(import.meta.url), "../attached_assets")
    }
  },
  root: path.resolve(fileURLToPath(import.meta.url), "../client"),
  build: {
    outDir: path.resolve(fileURLToPath(import.meta.url), "../dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "../dist/public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
dotenv.config();
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
