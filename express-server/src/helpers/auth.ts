import { ErrorResponse } from "../handler/errorHandler";
import { getUserById } from "../handler/userHandler";

export const Auth = async (userId: number) => {
  const user = await getUserById(userId);
  if (!user)
    return ErrorResponse({
      message: "opss you are unautorized",
      status: 401,
      code: "UNAUTORIZED",
    });
  return user;
};
