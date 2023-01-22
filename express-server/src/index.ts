import "reflect-metadata";
import * as dotenv from "dotenv";
import express from "express";
import http from "http";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import bodyParser from "body-parser";
import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";
import { conn } from "./data-source";
import Note from "./schema/note";
import NoteResolver from "./resolvers/noteResolver";
import UserResolver from "./resolvers/userResolver";
import User from "./schema/user";
import { MyContext } from "./type";
import { __prod__ } from "./constants";

dotenv.config();

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
  const RedisStore = connectRedis(session);
  const redisClient = new Redis(process.env.REDIS_URL as string);

  // Same ApolloServer initialization as before, plus the drain plugin
  // for our httpServer
  const server = new ApolloServer({
    typeDefs: [Note, User],
    resolvers: [NoteResolver, UserResolver],
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageLocalDefault({
        footer: false,
        embed: false,
      }),
    ],
  });
  // ensure we wait for our server to start
  await server.start();

  const SESSION_SECRET = process.env.SESSION_SECRET as string;

  app.set("trust proxy", 1);

  app.use(
    "/graphql",
    cors<cors.CorsRequest>({
      credentials: true,
      origin: [
        "https://studio.apollographql.com",
        "http://localhost:4000/graphql",
      ],
    }),
    session({
      name: "gassess",
      store: new RedisStore({
        client: redisClient as any,
        disableTouch: false,
      }),
      cookie: {
        secure: true,
        httpOnly: true,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24,
      },
      secret: "dsfsdfdsfsdf",
      resave: false,
      saveUninitialized: false,
    }),
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
  console.log(`🚀 Server ready at http://localhost:4000/graphql`);
}
// run entire app
main().catch((err) => {
  console.log(err);
});
