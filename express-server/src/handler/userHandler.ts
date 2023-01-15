import { DataSource } from "typeorm";
import { conn } from "../data-source";
import { User } from "../entity/User";

export const getUserByEmail = async (email: string) => {
  const userRepo = conn.getRepository(User);
  const user = await userRepo.findOneBy({ email: email });
  return user;
};
