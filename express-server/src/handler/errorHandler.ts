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

export const validateName = (name: string) => {
  if (name.length === 0) {
    return "Name is require";
  }
  if (name.length < 5) {
    return "Name at leats 5 characters long";
  }
};

export const validateEmail = (Email: string) => {
  if (Email.length === 0) {
    return "Email is required";
  }
  if (Email.length < 5) {
    return "Email at leats 5 characters long";
  }
};

export const validatePassword = (password: string) => {
  if (password.length === 0) {
    return "password is required";
  }
  if (password.length < 5) {
    return "password at leats 5 characters long";
  }
};
