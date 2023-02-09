import {
  LogoutQuery,
  useLogoutQuery,
  useUserQuery,
} from "@/generated/generated";
import graphqlRequestClient from "@/request/graphqlRequestClient";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";

export default function Navbar() {
  const router = useRouter();
  const user = useUserQuery(graphqlRequestClient);
  const queryClient = useQueryClient();
  const { refetch } = useLogoutQuery(
    graphqlRequestClient,
    {},
    {
      enabled: false,
      onSuccess(data: LogoutQuery) {
        console.log(data);
        queryClient.clear();
        router.push("/login");
      },
      onError(error: any) {
        error.response.errors.forEach((err: any) => {
          queryClient.clear();
          router.push("/login");
        });
      },
    }
  );
  function logoutHandler() {
    refetch();
  }
  return (
    <div className="border rounded-md px-4 py-2 flex justify-between items-center bg-cyan-800">
      <div className="font-bold text-xl text-orange-500">NOTE APP</div>
      <div className="flex gap-4">
        <span className="font-semibold text-cyan-100">
          {user.data?.getMe?.name}
        </span>
        <button
          type="submit"
          onClick={logoutHandler}
          className="text-orange-500"
        >
          logout
        </button>
      </div>
    </div>
  );
}
