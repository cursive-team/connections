import {ManagedChipClient} from "@/lib/controller/chip/managed/client";

ManagedChipClient.prototype.GetChipAttendance = async function (
  chipId: string
): Promise<string[] | null> {

  const attendance = await this.prismaClient.edgeCityAttendance.findFirst({
    where: {
      chipId
    },
  });

  if (attendance?.weeks) {
    return attendance.weeks;
  }

  return null;
};