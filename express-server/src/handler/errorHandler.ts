import { GraphQLError } from "graphql";

export const ErrorResponse = (
  message: string,
  status: number,
  code?: string
) => {
  throw new GraphQLError(message, {
    extensions: {
      http: {
        code: code,
        status: status,
      },
    },
  });
};
