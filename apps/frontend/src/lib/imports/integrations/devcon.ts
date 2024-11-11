import { DevconSchedule, DevconScheduleData, DevconScheduleDataSchema, ErrorResponse } from "@types";

export async function devFetchSchedule(username: string): Promise<DevconSchedule | null> {
  try {
    const response = await fetch(`https://api.devcon.org/account/${username}/schedule`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response || !response.ok) {
      const { error }: ErrorResponse = await response.json();
      throw new Error(error);
    }

    const data = await response.json();
    if (data && data.error) {
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${data.error}, consider checking environment variables or redirect_uri`
      );
    }

    const ScheduleData: DevconScheduleData = DevconScheduleDataSchema.parse(data);
    return ScheduleData.data;
  } catch (error) {
    console.error(`Error importing Devcon schedule: ${error}`)
    return null;
  }
}