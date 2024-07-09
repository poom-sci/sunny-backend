import postgres from "src/loaders/postgresql";
import * as schema from "src/database/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

// Interface สำหรับข้อมูลที่จะใช้ในการสร้างหรืออัปเดต chat
interface ChatInput {
  uid: string;
  date: string;
  createdBy: "user" | "system";
  isActive?: boolean;
}

// Create
async function createChat(input: ChatInput) {
  const result = await postgres
    .insert(schema.chat)
    .values({
      id: uuidv4(),
      ...input,
      date: new Date(input.date).toISOString().split("T")[0] // แปลงเป็น ISO date string
    })
    .returning();

  return result[0];
}

// Read
async function getChatById(id: string) {
  const result = await postgres
    .select()
    .from(schema.chat)
    .where(eq(schema.chat.id, id))
    .limit(1);

  return result[0] || null;
}

async function getAllChats(offset: number, limit: number) {
  return await postgres
    .select()
    .from(schema.chat)
    .orderBy(desc(schema.chat.createdAt))
    .limit(limit)
    .offset(offset);
}

// Update
async function updateChat(id: string, input: Partial<ChatInput>) {
  const updateData = { ...input };
  if (input.date) {
    updateData.date = new Date(input.date).toISOString().split("T")[0];
  }

  const result = await postgres
    .update(schema.chat)
    .set(updateData)
    .where(eq(schema.chat.id, id))
    .returning();

  return result[0];
}

// Delete (soft delete by setting isActive to false)
async function deleteChat(id: string) {
  const result = await postgres
    .update(schema.chat)
    .set({ isActive: false })
    .where(eq(schema.chat.id, id))
    .returning();

  return result[0];
}

// Upsert
async function upsertChat(input: ChatInput & { id?: string }) {
  const result = await postgres
    .insert(schema.chat)
    .values({
      id: input.id || uuidv4(),
      ...input,
      updatedAt: new Date(),
      date: new Date(input.date).toISOString().split("T")[0]
    })
    .onConflictDoUpdate({
      target: schema.chat.id,
      set: {
        updatedAt: new Date()
      }
    })
    .returning();

  return result[0];
}

// Get chat by UID
async function getChatByUid(uid: string) {
  const result = await postgres
    .select()
    .from(schema.chat)
    .where(and(eq(schema.chat.uid, uid), eq(schema.chat.isActive, true)))
    .limit(1);

  return result[0] || null;
}
async function getChatsByFilter(filters: Partial<ChatInput>) {
  let query = postgres.select().from(schema.chat);

  const queries: any[] = [];
  if (filters.uid) {
    queries.push(eq(schema.chat.uid, filters.uid));
  }

  if (filters.date) {
    const formattedDate = new Date(filters.date).toISOString().split("T")[0];
    queries.push(eq(schema.chat.date, formattedDate));
  }

  if (filters.createdBy) {
    queries.push(eq(schema.chat.createdBy, filters.createdBy));
  }

  if (filters.isActive !== undefined) {
    queries.push(eq(schema.chat.isActive, filters.isActive));
  }

  query = query.where(and(...queries));
  const result = await query;
  return result;
}

export default {
  createChat,
  getChatById,
  getAllChats,
  updateChat,
  deleteChat,
  upsertChat,
  getChatByUid,
  getChatsByFilter
};
