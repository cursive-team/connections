import { JobApi, JobResult } from "@taceo/csn-api-client";

export async function pollJobResult(
  apiInstance: JobApi,
  id: string
): Promise<JobResult | null> {
  try {
    const getStatusRes = await apiInstance.getStatus({ id: id });
    if (getStatusRes.status == "Completed") {
      console.info("success:", getStatusRes);
      return getStatusRes;
    } else if (getStatusRes.status == "Failed") {
      console.info("failed:", getStatusRes);
      return null;
    }
  } catch (error) {
    console.error("error:", error);
  }
  return null;
}
