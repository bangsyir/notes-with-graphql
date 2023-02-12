import formReducer from "@/reducer/formReducer";
import React from "react";
import Router from "next/router";
import { GetServerSideProps } from "next";
import graphqlRequestClient from "@/request/graphqlRequestClient";
import { useLoginMutation } from "@/generated/generated";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export default function Login() {
  const queryClient = useQueryClient();
  const { isLoading, error, mutate } = useLoginMutation(graphqlRequestClient, {
    onSuccess(data: any) {
      toast("Welcome back!", {
        type: "success",
        position: "top-right",
      });
      return Router.push("/");
    },
    onError(error: any) {
      queryClient.clear();
      return Router.push("/login");
    },
    retry: false,
  });
  const [formData, setFormData] = React.useReducer(formReducer, {});
  const loginHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    // const signin = await login({
    //   variables: { email: formData.email, password: formData.password },
    // });
    mutate({ email: formData.email, password: formData.password });
  };
  return (
    <>
      <main className="container mx-auto px-4">
        <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-8">
            <div className="w-full max-w-md space-y-8">
              <span className="font-bold text-xl">Login</span>
            </div>
            {error && isLoading == false && (
              <div className="bg-red-500 text-white border rounded-md px-2 py-1">
                {error.response.errors[0].message}
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
                  className="w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-cyan-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  type="text"
                  name="email"
                  id="email"
                  onChange={setFormData}
                />
              </div>
              <div className="flex flex-col flex-wrap">
                <label>Password</label>
                <input
                  className="w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-cyan-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  type="password"
                  name="password"
                  id="password"
                  onChange={setFormData}
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="group relative flex w-full justify-center rounded-md border border-transparent bg-cyan-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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
