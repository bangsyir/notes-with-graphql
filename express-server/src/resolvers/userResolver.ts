import { conn } from "../data-source";
import { User } from "../entity/User";
import { getUserByEmail, getUserById } from "../handler/userHandler";
import { MyContext } from "../type";
import {
  ErrorResponse,
  validateEmail,
  validateName,
  validatePassword,
} from "../handler/errorHandler";
import { hash, verifySync } from "@node-rs/bcrypt";

declare module "express-session" {
  interface SessionData {
    sub: string;
  }
}

const UserResolver = {
  Query: {
    async getMe(parent: any, args: any, { session }: MyContext) {
      // get userId from session
      const userId = session.sub as number;
      // check user if available
      const user = await getUserById(userId);
      // if user not found return error
      if (!user) ErrorResponse({ message: "User is not authenticated" });
      // else return user
      return user;
    },
  },
  Mutation: {
    async register(
      _: User,
      args: {
        name: string;
        email: string;
        password: string;
      }
    ) {
      // check email if exist
      // if found return error else execute next line
      const errors = {
        name: validateName(args.name),
        email: validateEmail(args.email),
        password: validatePassword(args.password),
      };
      if (Object.keys(errors).some(Boolean)) {
        return { status: "errors", message: "input errors", errors };
      }
      const checkUser = await getUserByEmail(args.email);
      if (checkUser)
        return ErrorResponse({
          message: "This email already registered",
          code: "BAD_REQUEST",
        });
      // get password and generate to hash string
      const passwordHash = await hash(args.password, 10);
      // initialize user
      const user = new User();
      user.name = args.name;
      user.email = args.email;
      user.password = passwordHash;
      // save user to database
      await conn.manager.save(user);
      // return user
      return user;
    },
    async login(
      parent: User,
      args: { email: string; password: string },
      { req }: MyContext
    ) {
      // else check use from input "email"
      const user = await getUserByEmail(args.email);
      // return error if not an user
      if (!user)
        return ErrorResponse({
          message: "email or password in wrong!",
          code: "BAD_USER_INPUT",
          argumentName: "email",
        });
      // compare password input with user.password hash
      const verifyHash = verifySync(args.password, user.password);
      // if false return error
      if (!verifyHash)
        return ErrorResponse({
          message: "email or password in wrong!",
          code: "BAD_USER_INPUT",
          argumentName: "password",
        });
      // create user session and send to  cookie headers
      req.session.sub = user.id;
      // return success user
      return { status: "success", message: "successfull", user };
    },
  },
};
export default UserResolver;
