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
  })
  .get("/mood/week/:uid", async (ctx: Ctx) => {
    const {
      uid
    }: {
      uid: string;
    } = ctx.params;

    const mood = await ctx.service.mood.getMoodCurrentWeek(uid);

    if (!mood) {
      return { mood: null };
      // throw new NotFoundError("mood not found.");
    }

    return { mood: mood };
  })
  .post("/mood/:uid", async (ctx: Ctx) => {
    const {
      uid,
      play,
      work,
      study,
      relationship,
      health
    }: {
      uid: string;
      play: number;
      work: number;
      study: number;
      relationship: number;
      health: number;
    } = ctx.body as any;

    const user = await ctx.domain.personal.getPersonalByFirebaseUid(uid);

    if (!user) {
      throw new NotFoundError("User not found.");
    }

    const mood = await ctx.service.mood.createMood(uid, {
      play,
      work,
      study,
      relationship,
      health
    });

    return {
      detail: "Mood updated.",
      data: mood
    };
  })
  .post("/summary", async (ctx: Ctx) => {
    const {
      uid,
      date
    }: {
      uid: string;
      date: string;
    } = ctx.body as any;

    const summary = await ctx.service.chat.createSummaryChat(uid, date);

    return {
      detail: "Summary created.",
      data: summary
    };
  })
  .get("/summary/all/:uid", async (ctx: Ctx) => {
    const {
      uid
    }: {
      uid: string;
    } = ctx.params;

    const summary = await ctx.service.chat.getAllChatsSummary(uid);

    return {
      detail: "Summary created.",
      data: summary
    };
  })
  .get("/goal/:uid", async (ctx: Ctx) => {
    const {
      uid
    }: {
      uid: string;
    } = ctx.params;

    const goal = await ctx.service.goal.getGoal(uid);

    return {
      detail: "Goal created.",
      data: goal
    };
  })
  .post("/goal", async (ctx: Ctx) => {
    const {
      uid,
      title,
      description,
      duration
    }: {
      uid: string;
      title: string;
      description: string;
      duration: string;
    } = ctx.body as any;

    const goal = await ctx.service.goal.createGoal({
      uid,
      title,
      description,
      duration
    });

    return {
      detail: "Goal created.",
      data: goal
    };
  })
  .get("/goal-detail/:id", async (ctx: Ctx) => {
    const {
      id
    }: {
      id: string;
    } = ctx.params;

    const goal = await ctx.service.goal.getGoalById(id);

    return {
      detail: "Goal created.",
      data: goal
    };
  });

export default personalController;
