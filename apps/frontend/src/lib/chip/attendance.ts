import {BASE_API_URL} from "@/config";
import {ChipAttendanceSchema} from "@types";

export const getChipAttendance = async (authToken: string, chipId: string): Promise<string[] | null> => {
  const response = await fetch(`${BASE_API_URL}/chip/${chipId}/attendance?authToken=${authToken}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get chip attendance: ${response.statusText}`);
  }

  try {
    const data = await response.json();
    const { weeks } = ChipAttendanceSchema.parse(data);
    return weeks;
  } catch (error) {
    console.error("Error getting chip attendance:", error);
    return null;
  }
};