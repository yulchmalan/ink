import express from "express";
import dotenv from "dotenv";

import indexRouter from "./routes/index.js";
import authRouter from "./routes/auth.js";
import usersRoutes from "./routes/user.route.js";
import { connectDB } from "./config/db.js";

const port = 3000;
const app = express();
dotenv.config();
app.use(express.json());

app.get("/", indexRouter);
app.get("/auth", authRouter);
app.use("/api/users", usersRoutes);
app.listen(port, () => {
  connectDB();
  console.log(`server is running at http://localhost:${port}`);
});
