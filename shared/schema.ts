
import { z } from "zod";

// === ZOD SCHEMAS ===

export const insertIntentionSchema = z.object({
  content: z.string().min(1, "Intention content is required"),
  name: z.string().optional(),
  prayerType: z.string().optional(),
});

export const insertChallengeSchema = z.object({
  title: z.string().min(1, "Challenge title is required"),
  prayerType: z.string().min(1, "Prayer type is required"),
  totalTarget: z.number().int().min(1, "Target must be at least 1"),
});

// === TYPE DEFINITIONS ===

export type Intention = {
  id: number;
  content: string;
  name?: string | null;
  prayerType?: string | null;
  hailMaryCount: number;
  ourFatherCount: number;
  rosaryCount: number;
  isPrinted: boolean;
  createdAt: string;
};

export type InsertIntention = z.infer<typeof insertIntentionSchema>;

export type Challenge = {
  id: number;
  title: string;
  prayerType: string;
  totalTarget: number;
  currentCount: number;
  isActive: boolean;
  createdAt: string;
};

export type InsertChallenge = z.infer<typeof insertChallengeSchema>;

// API Request/Response Types
export type CreateIntentionRequest = InsertIntention;
export type CreateChallengeRequest = InsertChallenge;

export type IncrementChallengeRequest = { amount: number };
export type IncrementIntentionPrayerRequest = { type: 'hailMary' | 'ourFather' | 'rosary' };

export type IntentionResponse = Intention;
export type ChallengeResponse = Challenge;
