import postgres from "src/loaders/postgresql";
import * as schema from "src/database/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

// Interface สำหรับข้อมูลที่จะใช้ในการสร้างหรืออัปเดต message
interface MessageInput {
  uid: string;
  chatId: string;
  date: string;
  text: string;
  status: "pending" | "processing" | "failed" | "success";
  createdBy: "user" | "system";
  isActive?: boolean;
}

// Create
async function createMessage(input: MessageInput) {
  const result = await postgres
    .insert(schema.message)
    .values({
      id: uuidv4(),
      ...input,
      date: new Date(input.date).toISOString().split("T")[0]
    })
    .returning();

  return result[0];
}

// Read
async function getMessageById(id: string) {
  const result = await postgres
    .select()
    .from(schema.message)
    .where(eq(schema.message.id, id))
    .limit(1);

  return result[0] || null;
}

async function getMessagesByUid(uid: string) {
  return await postgres
    .select()
    .from(schema.message)
    .where(eq(schema.message.uid, uid))
    .orderBy(desc(schema.message.createdAt));
}

async function getMessagesByChatId(chatId: string) {
  return await postgres
    .select()
    .from(schema.message)
    .where(eq(schema.message.chatId, chatId))
    .orderBy(schema.message.createdAt);
}

// Update
async function updateMessage(id: string, input: Partial<MessageInput>) {
  const updateData = { ...input };
  if (input.date) {
    updateData.date = new Date(input.date).toISOString().split("T")[0];
  }

  const result = await postgres
    .update(schema.message)
    .set({ ...updateData, updatedAt: sql`CURRENT_TIMESTAMP` })
    .where(eq(schema.message.id, id))
    .returning();

  return result[0];
}

// Delete (soft delete by setting isActive to false)
async function deleteMessage(id: string) {
  const result = await postgres
    .update(schema.message)
    .set({ isActive: false, updatedAt: sql`CURRENT_TIMESTAMP` })
    .where(eq(schema.message.id, id))
    .returning();

  return result[0];
}

// Update message status
async function updateMessageStatus(
  id: string,
  status: "pending" | "processing" | "failed" | "success"
) {
  const result = await postgres
    .update(schema.message)
    .set({ status, updatedAt: sql`CURRENT_TIMESTAMP` })
    .where(eq(schema.message.id, id))
    .returning();

  return result[0];
}

// Get messages by status
async function getMessagesByStatus(
  status: "pending" | "processing" | "failed" | "success"
) {
  return await postgres
    .select()
    .from(schema.message)
    .where(eq(schema.message.status, status))
    .orderBy(schema.message.createdAt);
}

// Get active messages for a specific chat
async function getActiveMessagesByChatId(chatId: string) {
  return await postgres
    .select()
    .from(schema.message)
    .where(
      and(eq(schema.message.chatId, chatId), eq(schema.message.isActive, true))
    )
    .orderBy(schema.message.createdAt);
}

export default {
  createMessage,
  getMessageById,
  getMessagesByUid,
  getMessagesByChatId,
  updateMessage,
  deleteMessage,
  updateMessageStatus,
  getMessagesByStatus,
  getActiveMessagesByChatId
};
