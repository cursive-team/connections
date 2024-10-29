import express from "express";
import userRoutes from "./routes/user";
import chipRoutes from "./routes/chip";
import messageRoutes from "./routes/message";
import healthRoutes from "./routes/health";
import oauthRoutes from "./routes/oauth";
import lannaRoutes from "./routes/lanna";
import notificationRoutes from "./routes/notification";
import dataHashRoutes from "./routes/dataHash";
import { FRONTEND_URL } from "./constants";
import {
  errorToString,
  IntersectionState,
} from "@types";
const cors = require("cors");
import { WebSocketServer, WebSocket } from 'ws';
import { Controller } from "@/lib/controller";


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
app.use("/", healthRoutes);

app.locals.intersectionState = {} as IntersectionState;

const controller = new Controller();
controller
  .NotificationInitialize()
  .then(() => {
    console.log("Notification service initialized");
  })
  .catch((error) => {
    console.error("Failed to initialize notification service: ", error);
  });

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// TODO: move into new file and hoist here
const WS_PORT = process.env.WS_PORT || 8090;

const wsServer = new WebSocketServer({ port: Number(WS_PORT) })

const clients: Record<string, WebSocket> = {};

const handleError = (socket: WebSocket, target: string, error: string): void => {
  const payload: WebSocketErrorPayload = {
    error,
  }

  const resp: WebSocketResponse = {
    type: WebSocketResponseTypes.ERROR,
    targetSigPubKey: target,
    senderSigPubKey: "",
    payload
  }

  socket.send(JSON.stringify(resp))
  return;
}

wsServer.on('connection', (socket: WebSocket) => {

  socket.on('open', () => {
    console.log("Open ws client connection")
  });

  socket.on('message', async (message: string) => {
    const req: WebSocketRequest = WebSocketRequestSchema.parse(JSON.parse(message));

    if (!req.authToken) {
      return handleError(socket, req.senderSigPubKey, "Missing auth token.")
    }

    // Fetch user by auth token
    // While the user isn't specifically required, it ensures the request is from an authenticated user
    const user = await controller.GetUserByAuthToken(req.authToken);

    if (!user) {
      return handleError(socket, req.senderSigPubKey, "Invalid auth token.")
    }

    try {
      switch (req.type) {
        case WebSocketRequestTypes.CONNECT:
          if (!req.senderSigPubKey) {
            return handleError(socket, req.senderSigPubKey, "Missing target.")
          }

          // Set record for future lookup
          clients[req.senderSigPubKey] = socket;

          // NOTE: do I need to return response to signal successful connection?
          return;
        case WebSocketRequestTypes.CLOSE:
          if (!req.senderSigPubKey) {
            return handleError(socket, req.senderSigPubKey, "Missing target.")
          }
          delete clients[req.senderSigPubKey];
          socket.close();
          return;
        case WebSocketRequestTypes.MSG:
          if (!req.targetSigPubKey) {
            return handleError(socket, req.senderSigPubKey, "Invalid target")
          }

          const resp: WebSocketResponse = MapRequestToResponse(req);
          const stringResp: string = JSON.stringify(resp);

          if (clients[req.targetSigPubKey]) {
            clients[req.targetSigPubKey].send(stringResp);
          }
          return;
        default:
      };
    } catch (error) {
      return handleError(socket, req.senderSigPubKey, `Error handling message: ${errorToString(error)}`)
      return;
    };
  });

  socket.on('close', () => {
    console.log(`Close ws client connection`);
  });
});
