import postgres from "src/loaders/postgresql";
import * as schema from "src/database/schema";
import { eq, and, desc, sql, count } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

// Interface สำหรับข้อมูลที่จะใช้ในการสร้างหรืออัปเดต futureMe
interface FutureMeInput {
  uid: string;
  title: string;
  ideal: string;
  isActive?: boolean;
}

// Create
async function createFutureMe(input: FutureMeInput) {
  const result = await postgres
    .insert(schema.futureMe)
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
async function getFutureMeById(id: string) {
  const result = await postgres
    .select()
    .from(schema.futureMe)
    .where(eq(schema.futureMe.id, id))
    .limit(1);

  return result[0] || null;
}

async function getAllFutureMes(offset: number, limit: number) {
  return await postgres
    .select()
    .from(schema.futureMe)
    .orderBy(desc(schema.futureMe.createdAt))
    .limit(limit)
    .offset(offset);
}

// Update
async function updateFutureMe(id: string, input: Partial<FutureMeInput>) {
  const updateData = { ...input };

  const result = await postgres
    .update(schema.futureMe)
    .set({
      ...updateData,
      updatedAt: new Date()
    })
    .where(eq(schema.futureMe.id, id))
    .returning();

  return result[0];
}

// Delete (soft delete by setting isActive to false)
async function deleteFutureMe(id: string) {
  const result = await postgres
    .update(schema.futureMe)
    .set({ isActive: false })
    .where(eq(schema.futureMe.id, id))
    .returning();

  return result[0];
}

// Upsert
async function upsertFutureMe(input: FutureMeInput & { id?: string }) {
  const result = await postgres
    .insert(schema.futureMe)
    .values({
      id: input.id || uuidv4(),
      ...input,
      updatedAt: new Date(),
      createdAt: new Date()
    })
    .onConflictDoUpdate({
      target: schema.futureMe.id,
      set: {
        updatedAt: new Date(),
        title: input.title,
        ideal: input.ideal,
        isActive: input.isActive
      }
    })
    .returning();

  return result[0];
}

// Get futureMe by UID
async function getFutureMeByUid(uid: string) {
  const result = await postgres
    .select()
    .from(schema.futureMe)
    .where(
      and(eq(schema.futureMe.uid, uid), eq(schema.futureMe.isActive, true))
    )
    .limit(1);

  return result[0] || null;
}

// Get futureMes by filter
async function getFutureMesByFilter(filters: Partial<FutureMeInput>) {
  let query = postgres.select().from(schema.futureMe);

  if (filters.uid) {
    query = query.where(eq(schema.futureMe.uid, filters.uid));
  }

  if (filters.title) {
    query = query.where(eq(schema.futureMe.title, filters.title));
  }

  if (filters.ideal) {
    query = query.where(eq(schema.futureMe.ideal, filters.ideal));
  }

  if (filters.isActive !== undefined) {
    query = query.where(eq(schema.futureMe.isActive, filters.isActive));
  }

  const result = await query;
  return result;
}

export default {
  createFutureMe,
  getFutureMeById,
  getAllFutureMes,
  updateFutureMe,
  deleteFutureMe,
  upsertFutureMe,
  getFutureMeByUid,
  getFutureMesByFilter
};
