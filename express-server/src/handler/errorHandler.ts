import { GraphQLError } from "graphql";

export const ErrorResponse = ({
  message,
  status,
  code,
  argumentName,
}: {
  message: string;
  status?: Number;
  code?: string;
  argumentName?: string;
}) => {
  throw new GraphQLError(message, {
    extensions: {
      http: {
        status,
      },
      code,
      argumentName,
    },
  });
};
