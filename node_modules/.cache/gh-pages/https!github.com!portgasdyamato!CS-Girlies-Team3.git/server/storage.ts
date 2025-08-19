import { type User, type UpsertUser, type MoodSession, type InsertMoodSession, users, moodSessions } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  createMoodSession(session: InsertMoodSession & { 
    userId?: string;
    generatedOutfit?: any;
    generatedMoodboard?: any;
    generatedPoem?: string;
    generatedPlaylist?: any;
  }): Promise<MoodSession>;
  getMoodSession(id: string): Promise<MoodSession | undefined>;
  getMoodSessionsByUser(userId: string): Promise<MoodSession[]>;
  updateMoodSession(id: string, updates: Partial<MoodSession>): Promise<MoodSession>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.googleId,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async createMoodSession(sessionData: InsertMoodSession & { 
    userId?: string;
    generatedOutfit?: any;
    generatedMoodboard?: any;
    generatedPoem?: string;
    generatedPlaylist?: any;
  }): Promise<MoodSession> {
    const [session] = await db
      .insert(moodSessions)
      .values({
        userId: sessionData.userId || null,
        mood: sessionData.mood,
        moodEmoji: sessionData.moodEmoji || null,
        journalEntry: sessionData.journalEntry,
        generatedOutfit: sessionData.generatedOutfit || null,
        generatedMoodboard: sessionData.generatedMoodboard || null,
        generatedPoem: sessionData.generatedPoem || null,
        generatedPlaylist: sessionData.generatedPlaylist || null,
      })
      .returning();
    return session;
  }

  async getMoodSession(id: string): Promise<MoodSession | undefined> {
    const [session] = await db.select().from(moodSessions).where(eq(moodSessions.id, id));
    return session || undefined;
  }

  async getMoodSessionsByUser(userId: string): Promise<MoodSession[]> {
    return await db.select().from(moodSessions).where(eq(moodSessions.userId, userId));
  }

  async updateMoodSession(id: string, updates: Partial<MoodSession>): Promise<MoodSession> {
    const [session] = await db
      .update(moodSessions)
      .set(updates)
      .where(eq(moodSessions.id, id))
      .returning();
    if (!session) {
      throw new Error("Session not found");
    }
    return session;
  }
}

export const storage = new DatabaseStorage();
