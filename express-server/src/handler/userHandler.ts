import { conn } from "../data-source";
import { User } from "../entity/User";

export const getUserByEmail = async (email: string) => {
  const user = await conn
    .getRepository(User)
    .createQueryBuilder("user")
    .where("user.email = :email", { email: email })
    .getOne();
  return user;
};

export const getUserById = async (userId: number) => {
  const user = await conn
    .getRepository(User)
    .createQueryBuilder("user")
    .where("user.id = :userId", { userId })
    .getOne();

  return user;
};
