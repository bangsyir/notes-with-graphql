import { Response } from "express";
import { conn } from "../data-source";
import { User } from "../entity/User";
import { getUserByEmail } from "../handler/userHandler";
import { MyContext } from "../type";
import { hash } from "@node-rs/bcrypt";

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
      const passwordHash = await hash(args.password, 10);
      const user = new User();
      user.name = args.name;
      user.email = args.email;
      user.password = passwordHash;

      await conn.manager.save(user);
      return user;
    },
    async login(
      parent: User,
      args: { email: string; password: string },
      { req, res }: MyContext
    ) {
      const user = await getUserByEmail(args.email);
      console.log(user);
      if (!user) throw new Error("email or password is wrong");

      res.cookie("test", "test", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      console.log(req.cookies);
      return { status: "success", message: "successfull", user };
    },
  },
};
export default UserResolver;
