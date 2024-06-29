import postgres from "src/loaders/postgresql";
import * as schema from "src/database/schema";
import { eq, and, desc, sql, count } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

// Interface สำหรับข้อมูลที่จะใช้ในการสร้างหรืออัปเดต mood
interface MoodInput {
  uid: string;
  date: string;
  week: number;
  play: number;
  work: number;
  study: number;
  relationship: number;
  health: number;
  isActive?: boolean;
}

// Create
async function createMood(input: MoodInput) {
  const result = await postgres
    .insert(schema.mood)
    .values({
      id: uuidv4(),
      ...input,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    .returning();

  return result[0];
}

// Read
async function getMoodById(id: string) {
  const result = await postgres
    .select()
    .from(schema.mood)
    .where(eq(schema.mood.id, id))
    .limit(1);

  return result[0] || null;
}

async function getAllMoods(offset: number, limit: number) {
  return await postgres
    .select()
    .from(schema.mood)
    .orderBy(desc(schema.mood.createdAt))
    .limit(limit)
    .offset(offset);
}

// Update
async function updateMood(id: string, input: Partial<MoodInput>) {
  const updateData = { ...input };
  if (input.date) {
    updateData.date = new Date(input.date).toISOString().split("T")[0];
  }

  const result = await postgres
    .update(schema.mood)
    .set({
      ...updateData,
      updatedAt: new Date()
    })
    .where(eq(schema.mood.id, id))
    .returning();

  return result[0];
}

// Delete (soft delete by setting isActive to false)
async function deleteMood(id: string) {
  const result = await postgres
    .update(schema.mood)
    .set({ isActive: false })
    .where(eq(schema.mood.id, id))
    .returning();

  return result[0];
}

// Upsert
async function upsertMood(input: MoodInput & { id?: string }) {
  const result = await postgres
    .insert(schema.mood)
    .values({
      id: input.id || uuidv4(),
      ...input,
      updatedAt: new Date(),
      createdAt: new Date()
    })
    .onConflictDoUpdate({
      target: schema.mood.id,
      set: {
        updatedAt: new Date(),
        date: new Date(input.date).toISOString().split("T")[0],
        week: input.week,
        play: input.play,
        work: input.work,
        study: input.study,
        relationship: input.relationship,
        health: input.health,
        isActive: input.isActive
      }
    })
    .returning();

  return result[0];
}

// Get mood by UID
async function getMoodByUid(uid: string) {
  const result = await postgres
    .select()
    .from(schema.mood)
    .where(and(eq(schema.mood.uid, uid), eq(schema.mood.isActive, true)))
    .limit(1);

  return result[0] || null;
}

// Get moods by filter
async function getMoodsByFilter(filters: Partial<MoodInput>) {
  let query = postgres.select().from(schema.mood);

  if (filters.uid) {
    query = query.where(eq(schema.mood.uid, filters.uid));
  }

  if (filters.date) {
    query = query.where(
      eq(schema.mood.date, new Date(filters.date).toISOString().split("T")[0])
    );
  }

  if (filters.week !== undefined) {
    query = query.where(eq(schema.mood.week, filters.week));
  }

  if (filters.play !== undefined) {
    query = query.where(eq(schema.mood.play, filters.play));
  }

  if (filters.work !== undefined) {
    query = query.where(eq(schema.mood.work, filters.work));
  }

  if (filters.study !== undefined) {
    query = query.where(eq(schema.mood.study, filters.study));
  }

  if (filters.relationship !== undefined) {
    query = query.where(eq(schema.mood.relationship, filters.relationship));
  }

  if (filters.health !== undefined) {
    query = query.where(eq(schema.mood.health, filters.health));
  }

  if (filters.isActive !== undefined) {
    query = query.where(eq(schema.mood.isActive, filters.isActive));
  }

  const result = await query;
  return result;
}

export default {
  createMood,
  getMoodById,
  getAllMoods,
  updateMood,
  deleteMood,
  upsertMood,
  getMoodByUid,
  getMoodsByFilter
};
