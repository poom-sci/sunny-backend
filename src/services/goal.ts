import goalModel from "src/database/domain/goal";

export const createGoal = async ({
  uid,
  title,
  description,
  duration
}: any) => {
  try {
    const goal = await goalModel.createGoal({
      uid,
      title,
      description,
      duration,
      count: 0,
      isActive: true
    });

    return goal;
  } catch (error) {
    console.log(error);
  }
};

export const getGoal = async (uid: string) => {
  const goal = await goalModel.getGoalByUid(uid);

  return goal;
};


export const getGoalById = async (id: string) => {
  const goal = await goalModel.getGoalById(id);

  return goal;
}