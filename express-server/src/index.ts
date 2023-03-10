import "reflect-metadata";
import * as dotenv from "dotenv";
import express from "express";
import http from "http";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from "@apollo/server/plugin/landingPage/default";
import { json } from "body-parser";
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
import { graphqlUploadExpress } from "graphql-upload-ts";
import path from "path";

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
  app.use(express.static(path.join(__dirname, "../public")));
  app.get("/", async (req, res) => {
    res.send("hello");
  });
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
    csrfPrevention: true,
    cache: "bounded",
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      process.env.NODE_ENV === "production"
        ? ApolloServerPluginLandingPageProductionDefault()
        : ApolloServerPluginLandingPageLocalDefault({ embed: false }),
    ],
    includeStacktraceInErrorResponses: true,
  });
  // ensure we wait for our server to start
  await server.start();

  const SESSION_SECRET = process.env.SESSION_SECRET as string;

  // app.set("trust proxy", 1);

  app.use(
    "/graphql",
    graphqlUploadExpress({ maxFileSize: 10000000 }),
    cors<cors.CorsRequest>({
      credentials: true,
      origin: ["https://studio.apollographql.com", "http://localhost:3000"],
    }),
    session({
      name: "gassess",
      store: new RedisStore({
        client: redisClient as any,
        disableTouch: false,
      }),
      cookie: {
        secure: false, //set true for https
        httpOnly: true,
        sameSite: "lax", //set none  for https
        maxAge: 1000 * 60 * 60 * 24,
      },
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    }),
    json({ limit: "50mb" }),

    // expressMiddlware accept the same arguments:
    // an Apollo Server instance and optional configuration options
    expressMiddleware<MyContext>(server, {
      context: async ({ req, res }) => ({ req, res, session: req.session }),
    })
  );

  // modified server startup
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  );
  // test
  console.log(`???? Server ready at http://localhost:4000/graphql`);
}
// run entire app
main();
