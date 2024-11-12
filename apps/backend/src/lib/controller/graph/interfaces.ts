import { EdgeData } from "@/lib/controller/graph/types";
import { ErrorResponse, GraphEdgeResponse } from "@types";

export interface iGraphClient {
  UpsertGraphEdge(id: string | null, tapSenderId: string | null, tapReceiverId: string | null): Promise<string | ErrorResponse>;
  GetGraphEdges(fetchUpdatedAtAfter: Date | undefined): Promise<GraphEdgeResponse | ErrorResponse>;
  // TODO: add edge revocation by submitting hash(private sig key)
}