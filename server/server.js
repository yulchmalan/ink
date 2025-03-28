import express from "express";
import dotenv from "dotenv";

import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import indexRouter from "./routes/index.js";
import authRouter from "./routes/auth.js";
import usersRoutes from "./routes/user.route.js";
import { connectDB } from "./config/db.js";
import { typeDefs, resolvers } from "./graphql/index.js";
import { expressMiddleware } from "@apollo/server/express4";

const port = 3000;

//server setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

await server.start();

//stara pizda
const app = express();
dotenv.config();
app.use(express.json());

app.get("/", indexRouter);
app.get("/auth", authRouter);
app.use("/graphql", expressMiddleware(server));
// app.use("/api/users", usersRoutes);

app.listen(port, () => {
  connectDB();
  console.log(`server is running at http://localhost:${port}`);
});
