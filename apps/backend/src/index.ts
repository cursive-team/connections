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
import { WebSocketServer } from 'ws';
import { IntersectionState } from "@types";
import { Controller } from "./lib/controller";
import * as http from 'http';
const cors = require("cors");

// Hoist websockets
import("./ws");

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

const server = http.createServer(app);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Use same server for websocket connection
export const wsServer = new WebSocketServer({ server })
