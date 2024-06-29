import { Elysia, NotFoundError, t } from "elysia";
import logger from "src/loaders/logger";
import { Ctx } from "src/type";
// import personalService from "src/services/personal";

const personalController = new Elysia({
  prefix: "/secure/auth",
  tags: ["personal"]
})
  .post(
    "/sign-up",
    async (ctx: Ctx) => {
      const {
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
        userName: string;
        firstName?: string;
        lastName?: string;
        phoneNumber?: string;
        registerType: "email" | "google" | "github";
        displayImage?: string;
        isEmailVerified?: boolean;
      } = ctx.body as any;

      try {
        const user = await ctx.service.personal.loginAndRegisterUser({
          firebaseUid,
          email,
          userName,
          firstName,
          lastName,
          phoneNumber,
          registerType,
          displayImage,
          isEmailVerified
        });

        return {
          detail: "User created.",
          user
        };
      } catch (error: any) {
        throw new Error(error.message || "Error while creating user.");
      }
    },
    {
      body: t.Object({
        firebaseUid: t.String({
          minLength: 1
        }),
        email: t.String({
          minLength: 1
        }),
        userName: t.Optional(
          t.String({
            minLength: 1
          })
        ),
        firstName: t.Optional(t.String()),
        lastName: t.Optional(t.String()),
        phoneNumber: t.Optional(t.String()),
        registerType: t.String({
          minLength: 1
        }),
        displayImage: t.Optional(t.String()),
        isEmailVerified: t.Optional(t.Boolean())
      })
    }
  )
  .get("/user/:uid", async (ctx: Ctx) => {
    const {
      uid
    }: {
      uid: string;
    } = ctx.params;

    logger.info("test", uid);

    const user = await ctx.domain.personal.getPersonalByFirebaseUid(uid);
    console.log("aasdasdfasdf", user);

    if (!user) {
      throw new NotFoundError("User not found.");
    }

    return { data: user };
  })
  .get("/intro/:uid", async (ctx: Ctx) => {
    const {
      uid
    }: {
      uid: string;
    } = ctx.params;

    const user = await ctx.domain.personal.getPersonalByFirebaseUid(uid);

    console.log("----", user);

    if (!user) {
      throw new NotFoundError("User not found.");
    }

    if (!user.age) {
      console.log("12312");
      return { isIntroComplete: false };
    }
    console.log("aaaaa");

    return { isIntroComplete: true };
  })
  .post("/intro/:uid", async (ctx: Ctx) => {
    const {
      uid,
      age,
      color,
      gender,
      sunnyCategory,
      futureMe,
      futureMeIdeal
    }: {
      uid: string;
      age: number;
      color: string;
      gender: string;
      sunnyCategory: string;
      futureMe: string;
      futureMeIdeal: string;
    } = ctx.body as any;

    const user = await ctx.domain.personal.getPersonalByFirebaseUid(uid);

    if (!user) {
      throw new NotFoundError("User not found.");
    }

    const updatedUser = await ctx.domain.personal.updatePersonalByUid(uid, {
      age,
      color,
      gender,
      sunnyCategory
    });

    const oldFutureMe = await ctx.domain.futureMe.getFutureMeByUid(uid);

    const upsertFutureMe = await ctx.domain.futureMe.upsertFutureMe({
      id: oldFutureMe?.id,
      uid: uid,
      title: futureMe,
      ideal: futureMeIdeal
    });

    return {
      detail: "Intro updated.",
      data: updatedUser,
      futureMe: upsertFutureMe
    };
  });

export default personalController;
