import formReducer from "@/reducer/formReducer";
import React from "react";
import { gql, useMutation } from "@apollo/client";
import Router from "next/router";
import { GetServerSideProps } from "next";

const LOGIN_USER = gql`
  mutation Login($email: String, $password: String) {
    login(email: $email, password: $password) {
      user {
        name
        email
      }
    }
  }
`;
export default function Login() {
  const [login, { data, loading, error }] = useMutation(LOGIN_USER, {
    errorPolicy: "all",
  });
  const [formData, setFormData] = React.useReducer(formReducer, {});
  const loginHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const signin = await login({
      variables: { email: formData.email, password: formData.password },
    });
    if (signin.errors == null) return Router.push("/");
  };
  return (
    <>
      <main className="container mx-auto px-4">
        <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-8">
            <div className="w-full max-w-md space-y-8">
              <span className="font-bold text-xl">Login</span>
            </div>
            {error && loading == false && (
              <div className="bg-red-500 text-white border rounded-md px-2 py-1">
                {error.message}
              </div>
            )}
            <form
              className="grid grid-cols-1 gap-4"
              method="POST"
              onSubmit={loginHandler}
            >
              <div className="flex flex-col flex-wrap">
                <label>Email</label>
                <input
                  className="w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  type="text"
                  name="email"
                  id="email"
                  onChange={setFormData}
                />
              </div>
              <div className="flex flex-col flex-wrap">
                <label>Password</label>
                <input
                  className="w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  type="text"
                  name="password"
                  id="password"
                  onChange={setFormData}
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookie = ctx.req.headers.cookie;
  if (cookie?.split("=")[1]) {
    return {
      props: {},
      redirect: {
        destination: "/",
      },
    };
  }
  return {
    props: {},
  };
};
