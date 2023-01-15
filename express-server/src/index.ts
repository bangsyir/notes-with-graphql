import "reflect-metadata";
import express, { Response } from "express";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import bodyParser from "body-parser";
import { conn } from "./data-source";
import Note from "./schema/note";
import NoteResolver from "./resolvers/noteResolver";
import UserResolver from "./resolvers/userResolver";
import User from "./schema/user";
import { MyContext } from "./type";

async function main() {
  // initialize database
  await conn
    .initialize()
    .then(() => {
      console.log("connection is successfull");
    })
    .catch((err) => {
      console.log(err);
    });
  // require logic integratting with express
  const app = express();
  // our  httpServer handles incoming requrests to our express app.
  // below, we tell apollo server to "drain" this httpserver
  // enabling our servers to shutdown gracefully
  const httpServer = http.createServer(app);

  // Same ApolloServer initialization as before, plus the drain plugin
  // for our httpServer
  const server = new ApolloServer({
    typeDefs: [Note, User],
    resolvers: [NoteResolver, UserResolver],
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  // ensure we wait for our server to start
  await server.start();

  app.use(
    "/",
    cors<cors.CorsRequest>({
      credentials: true,
    }),
    cookieParser(),
    bodyParser.json(),
    // expressMiddlware accept the same arguments:
    // an Apollo Server instance and optional configuration options
    expressMiddleware<MyContext>(server, {
      context: async ({ req, res }) => ({ req, res, token: "" }),
    })
  );
  // modified server startup
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  );
  // test
  console.log(`🚀 Server ready at http://localhost:4000/`);
}
// run entire app
main().catch((err) => {
  console.log(err);
});
