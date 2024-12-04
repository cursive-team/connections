import { storage } from "@/lib/storage";
import { updateUserData } from "@/lib/storage/localStorage/user/userData";

export const toggleAutomaticPSISetting = async (): Promise<boolean> => {
  const { user, session } = await storage.getUserAndSession();
  if (user &&
    session &&
    session.authTokenValue &&
    session.authTokenExpiresAt > new Date()
  ) {
    const updatedUserData = user.userData;

    if (!updatedUserData.settings) {
      updatedUserData.settings = {};
    }

    updatedUserData.settings.automaticPSIEnabled = !updatedUserData.settings.automaticPSIEnabled;

    await updateUserData(updatedUserData)
    return true;
  }
  return false;
}