import { DataSource } from "typeorm";
import { Note } from "./entities/Note";
export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "./test.sql",
  entities: [Note],
  synchronize: true,
  logging: false,
});
