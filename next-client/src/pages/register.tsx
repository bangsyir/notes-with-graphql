import { useRegisterMutation } from "@/generated/generated";
import formReducer from "@/reducer/formReducer";
import graphqlRequestClient from "@/request/graphqlRequestClient";
import { useRouter } from "next/router";
import React from "react";

export default function Register() {
  const router = useRouter();
  const { data, isLoading, mutate } = useRegisterMutation<Error>(
    graphqlRequestClient,
    {
      onSuccess() {
        router.push("/login");
      },
      onError(error: any) {
        console.log(error);
      },
    }
  );
  const [formData, setFormData] = React.useReducer(formReducer, {});
  const registerHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    mutate({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });
    // if (signup.errors == null) return Router.push("/login");
  };
  return (
    <>
      <main className="container mx-auto px-4">
        <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-8">
            <div className="w-full max-w-md space-y-8">
              <span className="font-bold text-xl">Login</span>
            </div>
            <form
              className="grid grid-cols-1 gap-4"
              method="POST"
              onSubmit={registerHandler}
            >
              <div className="flex flex-col flex-wrap">
                <label>Name</label>
                <input
                  className="w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  type="text"
                  name="name"
                  id="name"
                  onChange={setFormData}
                />
                {/* {error && error.graphQLErrors[0].extensions.} */}
              </div>
              <div className="flex flex-col flex-wrap">
                <label>Email</label>
                <input
                  className="w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  type="text"
                  name="email"
                  id="email"
                  onChange={setFormData}
                />
                {/* {error && error.graphQLErrors[0].extensions.} */}
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
