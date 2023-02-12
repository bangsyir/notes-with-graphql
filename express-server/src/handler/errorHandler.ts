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
  if (name.length < 1) {
    return "Name is require";
  }
  if (name.length < 5) {
    return "Name at leats 5 characters long";
  }
};

export const validateEmail = (email: string) => {
  if (email.length === 0) {
    return "Email is required";
  }
  if (email.length < 5) {
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

export const validateTitle = (title: string) => {
  if (title.length === 0) {
    return "title is required";
  }
  if (title.length < 8) {
    return "title to short. at least 8 characters long";
  }
};

export const validateDesc = (desc: string) => {
  if (desc.length === 0) {
    return "description is required";
  }
  if (desc.length < 8) {
    return "description to short. at least 8 characters long";
  }
};
