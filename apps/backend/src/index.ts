import express from "express";
import userRoutes from "./routes/user";
import chipRoutes from "./routes/chip";
import messageRoutes from "./routes/message";
import healthRoutes from "./routes/health";
import oauthRoutes from "./routes/oauth";
import lannaRoutes from "./routes/lanna";
import notificationRoutes from "./routes/notification";
import dataHashRoutes from "./routes/dataHash";
import graphRoutes from "./routes/graph";
import { FRONTEND_URL } from "./constants";
import { Server, Socket } from "socket.io";
import {
  SocketRequestType,
  SocketRequestSchema,
  SocketRequest,
  SocketResponseType,
  SocketErrorPayload,
  errorToString,
} from "@types";
import { User } from "@/lib/controller/postgres/types";
import { IntersectionState } from "@types";
import { Controller } from "./lib/controller";
const cors = require("cors");
const cron = require("node-cron");

import * as http from "http";

const app = express();
const corsOptions = {
  origin: `${FRONTEND_URL}`,
};
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api/user", userRoutes);
app.use("/api/chip", chipRoutes);
app.use("/api/oauth", oauthRoutes);
app.use("/api/lanna", lannaRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/data_hash", dataHashRoutes);
app.use("/api/graph", graphRoutes);
app.use("/", healthRoutes);

app.locals.intersectionState = {} as IntersectionState;
app.locals.clientsSockets = {} as Record<string, string>;

const controller = new Controller();
controller
  .NotificationInitialize()
  .then(() => {
    console.log("Notification service initialized");
  })
  .catch((error) => {
    console.error("Failed to initialize notification service: ", error);
  });

export const server = http.createServer(app);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Socket Server:

// Extend the interface to include User info -- with the User info attached we do not need sender info in request
declare module "socket.io" {
  interface Socket {
    user: User;
  }
}

export const wsServer = new Server(server);

// Middleware to authenticate the socket connection
wsServer.use(async (socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error("Authentication error"));
  }

  // Fetch user by auth token
  const user = await controller.GetUserByAuthToken(token);

  if (!user) {
    return next(new Error("Authentication error"));
  } else {
    // Attach user info to socket object
    socket.user = user;
    app.locals.clientsSockets[user.signaturePublicKey] = socket.id;

    return next();
  }

  return next(new Error("Authentication error"));
});

const handleError = (socket: Socket, error: string): void => {
  const payload: SocketErrorPayload = {
    error,
  };

  socket.emit(SocketResponseType.ERROR, payload);
  return;
};

wsServer.on("connection", (socket: Socket) => {
  socket.on("open", () => {
    console.log("Open authenticated socket client connection.");
  });

  socket.on("disconnect", () => {
    console.log(`Disconnect socket client connection.`);
  });

  socket.on("message", async (message: string) => {
    let sender = socket.user.signaturePublicKey;
    let recipient: string | null = null;
    try {
      const req: SocketRequest = SocketRequestSchema.parse(JSON.parse(message));

      recipient = req.recipientSigPubKey;
      switch (req.type) {
        case SocketRequestType.TAP_BACK:
          if (!recipient) {
            return handleError(socket, "Missing recipient.");
          }

          if (app.locals.clientsSockets[recipient]) {
            const socketId = app.locals.clientsSockets[recipient];
            socket.to(socketId).emit(SocketRequestType.TAP_BACK);
          } else {
            // If client is not online, use telegram instead
            const user: User | null = await controller.GetUserBySigPubKey(
              recipient
            );
            if (user) {
              await controller.SendNotification(
                user.id,
                "You have a new tap back! Check out who in your activities!"
              );
            }
          }

          return;
        case SocketRequestType.PSI:
          if (!recipient) {
            return handleError(socket, "Missing recipient.");
          }

          if (app.locals.clientsSockets[recipient]) {
            const socketId = app.locals.clientsSockets[recipient];
            socket.to(socketId).emit(SocketRequestType.PSI);
          }
          return;
        case SocketRequestType.EXPUNGE:
          delete app.locals.clientsSockets[sender];
          socket.disconnect();
          return;
        default:
          return;
      }
    } catch (error) {
      const errMsg: string = `Error handling message: ${errorToString(error)}`;
      if (sender) {
        return handleError(socket, errMsg);
      }
      return;
    }
  });
});
