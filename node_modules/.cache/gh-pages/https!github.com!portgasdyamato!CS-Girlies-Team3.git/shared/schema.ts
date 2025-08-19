import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Google OAuth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Updated user schema for Google OAuth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  googleId: varchar("google_id").unique(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const moodSessions = pgTable("mood_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  mood: text("mood").notNull(),
  moodEmoji: text("mood_emoji"),
  journalEntry: text("journal_entry").notNull(),
  generatedOutfit: jsonb("generated_outfit"),
  generatedMoodboard: jsonb("generated_moodboard"),
  generatedPoem: text("generated_poem"),
  generatedPlaylist: jsonb("generated_playlist"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
  googleId: true,
});

export const insertMoodSessionSchema = createInsertSchema(moodSessions).pick({
  mood: true,
  moodEmoji: true,
  journalEntry: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertMoodSession = z.infer<typeof insertMoodSessionSchema>;
export type MoodSession = typeof moodSessions.$inferSelect;
