import type { Response } from "express";
import { ErrorResponse } from "../handler/errorHandler";
import { getUserById } from "../handler/userHandler";

export const Auth = async (userId: number, res: Response) => {
  const user = await getUserById(userId);
  if (!user) {
    res.clearCookie("gassess");
    return ErrorResponse({
      message: "opss you are unautorized",
      status: 401,
      code: "UNAUTORIZED",
    });
  }
  return user;
};
