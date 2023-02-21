import { DataSource, DataSourceOptions } from "typeorm";
import { Note } from "./entity/Note";

export const dataSourceOptions: DataSourceOptions = {
  type: "sqlite",
  database: "db.sqlite",
  entities: [__dirname + "/entity/*{.js,.ts}"],
  migrations: [__dirname + "/migrations/*{.js,.ts}"],
};

export const conn = new DataSource(dataSourceOptions);
