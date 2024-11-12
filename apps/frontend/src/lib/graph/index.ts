import {
  ErrorResponse,
  errorToString,
  UpsertSocialGraphEdgeRequest,
  UpsertSocialGraphEdgeResponse,
  UpsertSocialGraphEdgeResponseSchema,
} from "@types";
import { BASE_API_URL } from "@/config";


export async function upsertSocialGraphEdge(
  authToken: string,
  id: string | null,
  tapSenderId: string | null,
  tapReceiverId: string | null,
): Promise<UpsertSocialGraphEdgeResponse> {
  try {
    const request: UpsertSocialGraphEdgeRequest = { authToken, id, tapSenderId, tapReceiverId };
    const response = await fetch(`${BASE_API_URL}/graph/edge`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const { error }: ErrorResponse = await response.json();
      throw new Error(error);
    }

    const rawData = await response.json();
    const validatedData: UpsertSocialGraphEdgeResponse =
      UpsertSocialGraphEdgeResponseSchema.parse(rawData);

    return validatedData;
  } catch (error) {
    console.error("Upserting graph edge error:", errorToString(error));
    throw new Error(
      "Failed to upsert edge. Please check your credentials and try again."
    );
  }
}