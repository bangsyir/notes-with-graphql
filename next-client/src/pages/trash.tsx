import Layouts from "@/components/Layouts";
import {
  useDeleteNotePermanentMutation,
  useGetDeletedNotesQuery,
  useRestoreNoteMutation,
} from "@/generated/generated";
import graphqlRequestClient from "@/request/graphqlRequestClient";
import { useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
export default function Trash() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, isLoading } = useGetDeletedNotesQuery(
    graphqlRequestClient,
    {
      page: Number(router.query.page),
    },
    {
      keepPreviousData: true,
    }
  );

  const { mutate } = useDeleteNotePermanentMutation(graphqlRequestClient, {
    onSuccess() {
      queryClient.refetchQueries(useGetDeletedNotesQuery.getKey());
      toast("note has been deleted", {
        type: "success",
        position: "top-right",
      });
    },
  });
  const restore = useRestoreNoteMutation(graphqlRequestClient, {
    onSuccess() {
      queryClient.refetchQueries(useGetDeletedNotesQuery.getKey());
      toast("note has been restored", {
        type: "success",
        position: "top-right",
      });
    },
  });
  return (
    <>
      <Head>
        <title>Trash</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layouts>
        <div className="grid gap-4">
          {isLoading && <div className="text-center">Loading....</div>}
          {data?.getDeletedNotes?.notes?.length === 0 && (
            <div className="text-center">NO NOTES</div>
          )}
          <span className="font-bold text-lg">Trash</span>
          {data?.getDeletedNotes?.notes?.map((note) => (
            <div
              key={note?.id}
              className="flex justify-between items-start border rounded-md p-2"
            >
              <div>
                <div className="text-medium font-bold">{note?.title}</div>
                <div>{note?.description}</div>
                <div className="flex justify-between gap-4">
                  <small className="text-gray-500">
                    {moment(Number(note?.createdAt)).format("dddd DD/MM/YYYY")}
                  </small>
                  <small className="text-gray-500">
                    deleted:{" "}
                    {moment(Number(note?.deletedAt)).format("dddd DD/MM/YYYY")}
                  </small>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="border rounded-md px-2 bg-green-500 text-white"
                  onClick={() => restore.mutate({ noteId: Number(note?.id) })}
                >
                  restore
                </button>
                <button
                  type="submit"
                  className="border rounded-md px-2 bg-red-500 text-white"
                  onClick={() => mutate({ noteId: Number(note?.id) })}
                >
                  delete
                </button>
              </div>
            </div>
          ))}
          <div className="flex gap-4 justify-center">
            <Link
              href={`?page=${data?.getDeletedNotes?.prev}`}
              className={`border px-2 rounded-md hover:shadow-md ${
                data?.getDeletedNotes?.prev === null &&
                "pointer-events-none bg-gray-200"
              }`}
            >
              <span>Prev</span>
            </Link>
            <span>{router.query.page || 1}</span>
            <Link
              href={`?page=${data?.getDeletedNotes?.next}`}
              className={`border px-2 rounded-md hover:shadow-md ${
                data?.getDeletedNotes?.next === null &&
                "pointer-events-none bg-gray-200"
              }`}
            >
              <span>Next</span>
            </Link>
          </div>
        </div>
      </Layouts>
    </>
  );
}
