import express from "express";
import userRoutes from "./routes/user";
import chipRoutes from "./routes/chip";
import messageRoutes from "./routes/message";
import healthRoutes from "./routes/health";
import oauthRoutes from "./routes/oauth";
import lannaRoutes from "./routes/lanna";
import notificationRoutes from "./routes/notification";
import { FRONTEND_URL } from "./constants";
import { IntersectionState } from "@types";
import { Controller } from "./lib/controller";
const cors = require("cors");

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
