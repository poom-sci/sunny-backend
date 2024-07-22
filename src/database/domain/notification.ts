import postgres from "src/loaders/postgresql";
import * as schema from "src/database/schema";
import { eq, and, sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

// Interface สำหรับข้อมูลที่จะใช้ในการสร้างหรืออัปเดต notification
interface NotificationInput {
  uid: string;
  notificationTokenId: string;
  isActive?: boolean;
}

// Create
async function createNotification(input: NotificationInput) {
  const result = await postgres
    .insert(schema.notification)
    .values({
      id: uuidv4(),
      ...input,
      isActive: input.isActive ?? true
    })
    .returning();

  return result[0];
}

// Read
async function getNotificationById(id: string) {
  const result = await postgres
    .select()
    .from(schema.notification)
    .where(eq(schema.notification.id, id))
    .limit(1);

  return result[0] || null;
}

async function getNotificationsByUid(uid: string) {
  return await postgres
    .select()
    .from(schema.notification)
    .where(eq(schema.notification.uid, uid))
    .orderBy(schema.notification.createdAt);
}

// Update
async function updateNotification(
  id: string,
  input: Partial<NotificationInput>
) {
  const result = await postgres
    .update(schema.notification)
    .set({ ...input, updatedAt: sql`CURRENT_TIMESTAMP` })
    .where(eq(schema.notification.id, id))
    .returning();

  return result[0];
}

// Delete (soft delete by setting isActive to false)
async function deleteNotification(id: string) {
  const result = await postgres
    .update(schema.notification)
    .set({ isActive: false, updatedAt: sql`CURRENT_TIMESTAMP` })
    .where(eq(schema.notification.id, id))
    .returning();

  return result[0];
}

// Get active notifications for a specific user
async function getActiveNotificationsByUid(uid: string) {
  return await postgres
    .select()
    .from(schema.notification)
    .where(
      and(
        eq(schema.notification.uid, uid),
        eq(schema.notification.isActive, true)
      )
    )
    .orderBy(schema.notification.createdAt);
}

async function getNotificationsByTokenId(notificationTokenId: string) {
  return await postgres
    .select()
    .from(schema.notification)
    .where(eq(schema.notification.notificationTokenId, notificationTokenId))
    .orderBy(schema.notification.createdAt);
}

export default {
  createNotification,
  getNotificationById,
  getNotificationsByUid,
  updateNotification,
  deleteNotification,
  getActiveNotificationsByUid,
  getNotificationsByTokenId
};
