import { Response } from "express";
import { conn } from "../data-source";
import { User } from "../entity/User";
import { getUserByEmail } from "../handler/userHandler";
import { MyContext } from "../type";

const UserResolver = {
  Mutation: {
    async register(
      parent: User,
      args: {
        name: string;
        email: string;
        password: string;
      }
    ) {
      const user = new User();
      user.name = args.name;
      user.email = args.email;
      user.password = args.password;

      await conn.manager.save(user);
      return user;
    },
    async login(
      parent: User,
      args: { email: string; password: string },
      { req, res }: MyContext
    ) {
      const user = await getUserByEmail(args.email);
      if (!user) throw new Error("email or password is wrong");

      res.cookie("test", "test cookie");
      return { status: "success", message: "successfull", user };
    },
  },
};
export default UserResolver;
