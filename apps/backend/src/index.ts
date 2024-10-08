import express from "express";
import userRoutes from "./routes/user";
import chipRoutes from "./routes/chip";
import healthRoutes from "./routes/health";
import { FRONTEND_URL } from "./constants";

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
app.use("/", healthRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
