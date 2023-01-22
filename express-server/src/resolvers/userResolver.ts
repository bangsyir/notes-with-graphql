import { conn } from "../data-source";
import { User } from "../entity/User";
import { getUserByEmail } from "../handler/userHandler";
import { MyContext } from "../type";
import { hash } from "@node-rs/bcrypt";

declare module "express-session" {
  interface SessionData {
    sub: string;
  }
}

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

      if (!user) throw new Error("email or password is wrong");

      req.session.sub = user.id;
      return { status: "success", message: "successfull", user };
    },
  },
};
export default UserResolver;
