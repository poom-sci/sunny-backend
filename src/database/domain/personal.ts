import postgres from "src/loaders/postgresql";
import * as schema from "src/database/schema";
import { eq, and, sql, desc } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

async function upsertPersonal({
  firebaseUid,
  email,
  userName,
  firstName,
  lastName,
  phoneNumber,
  registerType,
  displayImage,
  isEmailVerified
}: {
  firebaseUid: string;
  email: string;
  userName?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  registerType: "email" | "google" | "github";
  displayImage?: string;
  isEmailVerified?: boolean;
}) {
  const result = await postgres
    .insert(schema.personal)
    .values({
      userId: uuidv4(),
      firebaseUid,
      email,
      userName: userName || "",
      firstName,
      lastName,
      phoneNumber,
      registerType,
      displayImage,
      isEmailVerified
    })
    .onConflictDoUpdate({
      target: schema.personal.firebaseUid,
      set: {
        lastLoginAt: new Date(),
        registerType: registerType,
        isEmailVerified: isEmailVerified
      }
    })
    .returning();

  return result[0];
}

async function getPersonalById(userId: string) {
  const result = await postgres
    .select()
    .from(schema.personal)
    .where(
      and(
        eq(schema.personal.userId, userId),
        eq(schema.personal.isActive, true)
      )
    )
    .limit(1);

  if (result.length === 0) {
    return null;
  }

  return result;
}

async function getPersonalByEmail(email: string) {
  const result = await postgres
    .select()
    .from(schema.personal)
    .where(
      and(eq(schema.personal.email, email), eq(schema.personal.isActive, true))
    )
    .limit(1);

  if (result.length === 0) {
    return null;
  }

  return result[0];
}

async function getPersonalByEmailAndRegisterType(
  email: string,
  registerType: "email" | "google" | "github"
) {
  const result = await postgres
    .select()
    .from(schema.personal)
    .where(
      and(
        eq(schema.personal.email, email),
        eq(schema.personal.registerType, registerType),
        eq(schema.personal.isActive, true)
      )
    )
    .limit(1);

  if (result.length === 0) {
    return null;
  }

  return result[0];
}

async function getPersonalByFirebaseUid(firebaseUid: string) {
  const result = await postgres
    .select()
    .from(schema.personal)
    .where(
      and(
        eq(schema.personal.firebaseUid, firebaseUid),
        eq(schema.personal.isActive, true)
      )
    )
    .limit(1);

  if (result.length === 0) {
    return null;
  }

  return result[0];
}

async function unactivePersonal(userId: string) {
  await postgres
    .update(schema.personal)
    .set({
      isActive: false
    })
    .where(
      and(
        eq(schema.personal.userId, userId),
        eq(schema.personal.isActive, true)
      )
    );
}

async function getPersonalList(offset: number, limit: number) {
  const result = await postgres
    .select({
      userId: schema.personal.userId,
      email: schema.personal.email,
      userName: schema.personal.userName,
      firstName: schema.personal.firstName,
      lastName: schema.personal.lastName,
      phoneNumber: schema.personal.phoneNumber,
      registerType: schema.personal.registerType,
      createdAt: schema.personal.createdAt
    })
    .from(schema.personal)
    .orderBy(desc(schema.personal.createdAt))
    .limit(limit)
    .offset(offset);

  return result;
}

async function updatePersonalByUid(firebaseUid: string, data: any) {
  await postgres
    .update(schema.personal)
    .set(data)
    .where(eq(schema.personal.firebaseUid, firebaseUid));
}

export default {
  upsertPersonal,
  getPersonalById,
  getPersonalByEmail,
  getPersonalByFirebaseUid,
  unactivePersonal,
  getPersonalByEmailAndRegisterType,
  getPersonalList,
  updatePersonalByUid
};
