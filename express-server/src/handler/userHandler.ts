import { DataSource } from "typeorm";
import { conn } from "../data-source";
import { User } from "../entity/User";

export const getUserByEmail = async (email: string) => {
  console.log(email);
  const user = await conn
    .getRepository(User)
    .createQueryBuilder("user")
    .where("user.email = :email", { email: email })
    .getOne();
  return user;
};
