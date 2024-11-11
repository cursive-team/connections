import { iGraphClient } from "@/lib/controller/graph/interfaces";
import { PrismaClient } from "@prisma/client";
import { EdgeData } from "../types";
import {
  GraphEdgeResponseSchema,
  GraphEdgeResponse,
  ErrorResponse,
  errorToString
} from "@types";

export class PrismaGraphClient implements iGraphClient {

  prismaClient: PrismaClient;

  constructor() {
    this.prismaClient = new PrismaClient();
  };

  async UpsertGraphEdge(id: string | null, tapSenderId: string | null, tapReceiverId: string | null): Promise<string | ErrorResponse> {

    // Only upsert available values, unfortunately there are four combinations
    let edge: EdgeData | null = null;
    try {
      const now = new Date();
      if (!tapSenderId && !tapReceiverId) {
        // I do not think this would ever be updated, but cover case anyways
        edge = await this.prismaClient.tapGraphEdge.upsert({
          where: {
            id: id || ''
          },
          update: {
            updatedAt: now,
          },
          create: {
            createdAt: now,
            updatedAt: now,
          },
        });
      } else if (tapSenderId && !tapReceiverId) {
        // If id not available, create, else update
        edge = await this.prismaClient.tapGraphEdge.upsert({
          where: {
            id: id || ''
          },
          update: {
            tapSenderId: tapSenderId,
            updatedAt: now,
          },
          create: {
            tapSenderId: tapSenderId,
            createdAt: now,
            updatedAt: now,
          },
        });
      } else if (!tapSenderId && tapReceiverId) {
        // If id not available, create, else update
        edge = await this.prismaClient.tapGraphEdge.upsert({
          where: {
            id: id || ''
          },
          update: {
            tapReceiverId: tapReceiverId,
            updatedAt: now,
          },
          create: {
            tapReceiverId: tapReceiverId,
            createdAt: now,
            updatedAt: now,
          },
        });
      } else if (tapSenderId && tapReceiverId) {
        // If id not available, create, else update
        edge = await this.prismaClient.tapGraphEdge.upsert({
          where: {
            id: id || ''
          },
          update: {
            tapSenderId: tapSenderId,
            tapReceiverId: tapReceiverId,
            updatedAt: now,
          },
          create: {
            tapSenderId: tapSenderId,
            tapReceiverId: tapReceiverId,
            createdAt: now,
            updatedAt: now,
          },
        });
      }
    } catch (error) {
      return { error: `Error upserting graph edge: ${errorToString(error)}` } as ErrorResponse;
    }

    if (!edge) {
      return "";
    }

    return edge.id;
  };

  async GetGraphEdges(fetchUpdatedAtAfter: Date | null): Promise<GraphEdgeResponse | ErrorResponse> {
    // TODO: collapse directions into one if possible, it may be non-trivial
    const fallbackTime: Date = new Date(0);
    try {
      const edges = await this.prismaClient.tapGraphEdge.findMany({
        where: {
          tapSenderId: {
            not: null,
          },
          tapReceiverId: {
            not: null,
          },
          updatedAt: {
            gt: fetchUpdatedAtAfter || fallbackTime,
          },
        },
        orderBy: {
          updatedAt: "asc",
        },
        select: {
          tapSenderId: true,
          tapReceiverId: true,
          updatedAt: true
        },
      });
      return GraphEdgeResponseSchema.parse(edges);
    } catch (error) {
      return { error: `Error getting graph edges: ${errorToString(error)}` } as ErrorResponse;
    }
  }
}