import postgres from "src/loaders/postgresql";
import * as schema from "src/database/schema";
import { eq, and, desc, inArray } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

// Interface สำหรับข้อมูลที่จะใช้ในการสร้างหรืออัปเดต summary
interface SummaryInput {
  uid: string;
  chatId: string;
  date: string;
  color: string;
  color1: string;
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
      createdAt: new Date(),
      updatedAt: new Date()
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
    .set({
      ...updateData,
      updatedAt: new Date()
    })
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
      updatedAt: new Date(),
      createdAt: new Date()
    })
    .onConflictDoUpdate({
      target: schema.summary.id,
      set: {
        updatedAt: new Date(),
        chatId: input.chatId,
        date: new Date(input.date).toISOString().split("T")[0],
        color: input.color,
        color1: input.color1,
        summary: input.summary,
        isActive: input.isActive
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

// Get summaries by filter
async function getSummariesByFilter(filters: Partial<SummaryInput>) {
  let query = postgres.select().from(schema.summary);

  if (filters.uid) {
    query = query.where(eq(schema.summary.uid, filters.uid));
  }

  if (filters.chatId) {
    query = query.where(eq(schema.summary.chatId, filters.chatId));
  }

  if (filters.date) {
    query = query.where(
      eq(
        schema.summary.date,
        new Date(filters.date).toISOString().split("T")[0]
      )
    );
  }

  if (filters.color) {
    query = query.where(eq(schema.summary.color, filters.color));
  }

  if (filters.color1) {
    query = query.where(eq(schema.summary.color1, filters.color1));
  }

  if (filters.summary) {
    query = query.where(eq(schema.summary.summary, filters.summary));
  }

  if (filters.isActive !== undefined) {
    query = query.where(eq(schema.summary.isActive, filters.isActive));
  }

  const result = await query;
  return result;
}

const getAllSummariesByListOfChatId = async (chatIds: string[]) => {
  const result = await postgres
    .select()
    .from(schema.summary)
    .where(inArray(schema.summary.chatId, chatIds))
    // .where(schema.summary.chatId.in(chatIds))
    .orderBy(desc(schema.summary.createdAt));

  return result;
};

export default {
  createSummary,
  getSummaryById,
  getAllSummaries,
  updateSummary,
  deleteSummary,
  upsertSummary,
  getSummaryByUid,
  getSummariesByFilter,
  getAllSummariesByListOfChatId
};
