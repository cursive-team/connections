import express from "express";
import userRoutes from "./routes/user";

const app = express();

app.use(express.json());

// Routes
app.use("/api/user", userRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
