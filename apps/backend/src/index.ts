import express from "express";
import userRoutes from "./routes/user";
import chipRoutes from "./routes/chip";
import messageRoutes from "./routes/message";
import healthRoutes from "./routes/health";
import oauthRoutes from "./routes/oauth";
import lannaRoutes from "./routes/lanna";
import { FRONTEND_URL } from "./constants";
import { IntersectionState } from "@types";
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
<<<<<<< HEAD
app.use("/api/oauth", oauthRoutes);
app.use("/api/lanna", lannaRoutes);
=======
app.use("/api/message", messageRoutes);
>>>>>>> 0aa4000 (working tap backs)
app.use("/", healthRoutes);

app.locals.intersectionState = {} as IntersectionState;

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
