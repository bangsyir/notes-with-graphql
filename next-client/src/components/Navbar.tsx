import { useLogoutQuery, useUserQuery } from "@/generated/generated";
import graphqlRequestClient from "@/request/graphqlRequestClient";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import AddNote from "./AddNote";
import { TrashIcon } from "./icons/TrashIcon";

export default function Navbar() {
  const [addNotemodal, setAddNoteModal] = React.useState(false);
  const router = useRouter();
  const { data, isLoading } = useUserQuery(
    graphqlRequestClient,
    {},
    {
      cacheTime: 300000,
      keepPreviousData: true,
      enabled: true,
    }
  );
  const queryClient = useQueryClient();
  const { refetch } = useLogoutQuery(
    graphqlRequestClient,
    {},
    {
      enabled: false,
      onSuccess() {
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
    <>
      <div className="border rounded-md px-4 py-2 flex justify-between items-center bg-cyan-800">
        <Link href={"/"}>
          <div className="font-bold text-xl text-orange-500">NOTE APP</div>
        </Link>
        <div className="flex gap-4 items-center">
          <div>
            <Link href={"/trash"}>
              <TrashIcon
                className={`h-5 w-5 ${
                  router.pathname === "/trash"
                    ? "text-red-400 text-sha"
                    : "text-cyan-200"
                }`}
              />
            </Link>
          </div>
          {router.pathname === "/" && (
            <div>
              <button
                className="text-cyan-100 border rounded-md px-2 font-bold hover:bg-cyan-700"
                onClick={() => setAddNoteModal(true)}
              >
                add note
              </button>
            </div>
          )}
          <span className="font-semibold text-cyan-100">
            {isLoading ? <div>Loading...</div> : data?.getMe?.name}
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
      {router.pathname === "/" && (
        <AddNote
          addNoteModal={addNotemodal}
          setAddNoteModal={setAddNoteModal}
        />
      )}
    </>
  );
}
