import personalDomain from "src/database/domain/personal";
import { validateToken } from "./auth";

const loginAndRegisterUser = async ({
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
}) => {
  // const user = await personalDomain.getPersonalByEmail(email);

  // console.log(user);
  // if (user) {
  //   // return user;
  //   if (user.registerType === registerType) {
  //     throw new Error("Register type is different.");
  //   }
  // }

  const newUser = await personalDomain.upsertPersonal({
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

  return newUser;
};

export { loginAndRegisterUser };
