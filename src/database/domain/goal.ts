import postgres from "src/loaders/postgresql";
import * as schema from "src/database/schema";
import { eq, and, desc, sql, count } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

// Interface สำหรับข้อมูลที่จะใช้ในการสร้างหรืออัปเดต goal
interface GoalInput {
  uid: string;
  title: string;
  description?: string;
  duration: number;
  count: number;
  isActive?: boolean;
}

// Create
async function createGoal(input: GoalInput) {
  const result = await postgres
    .insert(schema.goal)
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
async function getGoalById(id: string) {
  const result = await postgres
    .select()
    .from(schema.goal)
    .where(eq(schema.goal.id, id))
    .limit(1);

  return result[0] || null;
}

async function getAllGoals(offset: number, limit: number) {
  return await postgres
    .select()
    .from(schema.goal)
    .orderBy(desc(schema.goal.createdAt))
    .limit(limit)
    .offset(offset);
}

// Update
async function updateGoal(id: string, input: Partial<GoalInput>) {
  const updateData = { ...input };
  if (input.duration) {
    updateData.duration = input.duration;
  }
  if (input.count) {
    updateData.count = input.count;
  }

  const result = await postgres
    .update(schema.goal)
    .set({
      ...updateData,
      updatedAt: new Date()
    })
    .where(eq(schema.goal.id, id))
    .returning();

  return result[0];
}

// Delete (soft delete by setting isActive to false)
async function deleteGoal(id: string) {
  const result = await postgres
    .update(schema.goal)
    .set({ isActive: false })
    .where(eq(schema.goal.id, id))
    .returning();

  return result[0];
}

// Upsert
async function upsertGoal(input: GoalInput & { id?: string }) {
  const result = await postgres
    .insert(schema.goal)
    .values({
      id: input.id || uuidv4(),
      ...input,
      updatedAt: new Date(),
      createdAt: new Date()
    })
    .onConflictDoUpdate({
      target: schema.goal.id,
      set: {
        updatedAt: new Date(),
        title: input.title,
        description: input.description,
        duration: input.duration,
        count: input.count,
        isActive: input.isActive
      }
    })
    .returning();

  return result[0];
}

// Get goal by UID
async function getGoalByUid(uid: string) {
  const result = await postgres
    .select()
    .from(schema.goal)
    .where(and(eq(schema.goal.uid, uid), eq(schema.goal.isActive, true)))
    .limit(1);

  return result[0] || null;
}

// Get goals by filter
async function getGoalsByFilter(filters: Partial<GoalInput>) {
  let query = postgres.select().from(schema.goal);

  if (filters.uid) {
    query = query.where(eq(schema.goal.uid, filters.uid));
  }

  if (filters.title) {
    query = query.where(eq(schema.goal.title, filters.title));
  }

  if (filters.isActive !== undefined) {
    query = query.where(eq(schema.goal.isActive, filters.isActive));
  }

  const result = await query;
  return result;
}

export default {
  createGoal,
  getGoalById,
  getAllGoals,
  updateGoal,
  deleteGoal,
  upsertGoal,
  getGoalByUid,
  getGoalsByFilter
};
