import moodModel from "src/database/domain/mood";

function getCurrentWeekOfYear(): number {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const pastDaysOfYear = (now.getTime() - startOfYear.getTime()) / 86400000;

  // หารด้วย 7 เพื่อหาจำนวนสัปดาห์ และใช้ Math.ceil เพื่อปัดขึ้น
  return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
}

export const getMoodCurrentWeek = async (uid: string) => {
  const mood = await moodModel.getMoodsByFilter({
    uid: uid
  });

  const currentWeekOfTheYear = getCurrentWeekOfYear();

  if (mood.length > 0) {
    for (let i = 0; i < mood.length; i++) {
      if (mood[i].week == currentWeekOfTheYear) {
        return mood[i];
      }
    }
  }
  return null;
};

type MoodInput = {
  play: number;
  work: number;
  study: number;
  relationship: number;
  health: number;
};

export const createMood = async (uid: string, input: MoodInput) => {
  console.log("uid", uid, input);
  try {

    const mood = await moodModel.getMoodsByFilter({
        uid: uid
      });
    
      const currentWeekOfTheYear = getCurrentWeekOfYear();
    
      if (mood.length > 0) {
        for (let i = 0; i < mood.length; i++) {
          if (mood[i].week == currentWeekOfTheYear) {
            return mood[i];
          }
        }
      }
      
    const moodData = await moodModel.createMood({
      uid,
      ...input,
      week: getCurrentWeekOfYear(),
      date: new Date().toISOString().split("T")[0],
      isActive: true
    });
    return moodData;
  } catch (error) {
    console.log(error);
  }
};
