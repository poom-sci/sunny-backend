import postgres from "src/loaders/postgresql";
import * as schema from "src/database/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

// Interface สำหรับข้อมูลที่จะใช้ในการสร้างหรืออัปเดต summary
interface SummaryInput {
  uid: string;
  date: string;
  color: string;
  summary?: string;
  isActive?: boolean;
}

// Create
async function createSummary(input: SummaryInput) {
  const result = await postgres
    .insert(schema.summary)
    .values({
      id: uuidv4(),
      ...input,
      date: new Date(input.date).toISOString().split("T")[0]
    })
    .returning();

  return result[0];
}

// Read
async function getSummaryById(id: string) {
  const result = await postgres
    .select()
    .from(schema.summary)
    .where(eq(schema.summary.id, id))
    .limit(1);

  return result[0] || null;
}

async function getAllSummaries(offset: number, limit: number) {
  return await postgres
    .select()
    .from(schema.summary)
    .orderBy(desc(schema.summary.createdAt))
    .limit(limit)
    .offset(offset);
}

// Update
async function updateSummary(id: string, input: Partial<SummaryInput>) {
  const updateData = { ...input };
  if (input.date) {
    updateData.date = new Date(input.date).toISOString().split("T")[0];
  }

  const result = await postgres
    .update(schema.summary)
    .set(updateData)
    .where(eq(schema.summary.id, id))
    .returning();

  return result[0];
}

// Delete (soft delete by setting isActive to false)
async function deleteSummary(id: string) {
  const result = await postgres
    .update(schema.summary)
    .set({ isActive: false })
    .where(eq(schema.summary.id, id))
    .returning();

  return result[0];
}

// Upsert
async function upsertSummary(input: SummaryInput & { id?: string }) {
  const result = await postgres
    .insert(schema.summary)
    .values({
      id: input.id || uuidv4(),
      ...input,
      date: new Date(input.date).toISOString().split("T")[0]
    })
    .onConflictDoUpdate({
      target: schema.summary.id,
      set: {
        uid: input.uid,
        date: new Date(input.date).toISOString().split("T")[0],
        color: input.color,
        summary: input.summary,
        isActive: input.isActive,
        updatedAt: sql`CURRENT_TIMESTAMP`
      }
    })
    .returning();

  return result[0];
}

// Get summary by UID
async function getSummaryByUid(uid: string) {
  const result = await postgres
    .select()
    .from(schema.summary)
    .where(and(eq(schema.summary.uid, uid), eq(schema.summary.isActive, true)))
    .limit(1);

  return result[0] || null;
}

// Get summaries by date range
async function getSummariesByDateRange(startDate: string, endDate: string) {
  return await postgres
    .select()
    .from(schema.summary)
    .where(
      and(
        sql`${schema.summary.date} >= ${startDate}`,
        sql`${schema.summary.date} <= ${endDate}`,
        eq(schema.summary.isActive, true)
      )
    )
    .orderBy(schema.summary.date);
}

export default {
  createSummary,
  getSummaryById,
  getAllSummaries,
  updateSummary,
  deleteSummary,
  upsertSummary,
  getSummaryByUid,
  getSummariesByDateRange
};
