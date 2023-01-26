import { ErrorResponse } from "../handler/errorHandler";
import { getUserById } from "../handler/userHandler";

export const Auth = async (userId: number) => {
  const user = await getUserById(userId);
  if (!user)
    return ErrorResponse("opss you are unautorized", 401, "UNAUTORIZED");
  return user;
};
