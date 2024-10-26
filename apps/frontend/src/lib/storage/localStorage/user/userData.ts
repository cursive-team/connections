import { UserData } from "@/lib/storage/types";
import { createUserDataBackup } from "@/lib/backup";
import { saveBackupAndUpdateStorage } from "../utils";
import { getUserAndSession } from ".";
import { getChipAttendance } from "@/lib/chip/attendance";

export const updateUserData = async (userData: UserData): Promise<void> => {
  const { user, session } = await getUserAndSession();

  // If attendance is length 0, it should be backfilled
  if (userData && userData.attendance && userData.attendance.length === 0) {
    for (const chip of user.chips) {
      const weeks = await getChipAttendance(session.authTokenValue, chip.id);
      if (weeks) {
        userData.attendance = weeks;
        break;
      }
    }
  }

  const userDataBackup = createUserDataBackup({
    email: user.email,
    password: session.backupMasterPassword,
    userData,
  });

  await saveBackupAndUpdateStorage({
    user,
    session,
    newBackupData: [userDataBackup],
  });
};
