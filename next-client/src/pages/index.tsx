import Head from "next/head";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import {
  useGetNotesQuery,
  useDeleteNoteMutation,
  useDeleteNotesManyMutation,
} from "@/generated/generated";
import graphqlRequestClient, {
  graphqlRequest,
} from "@/request/graphqlRequestClient";
import { dehydrate, QueryClient, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React from "react";
import { toast } from "react-toastify";
import EditNote from "@/components/EditNote";
import Layouts from "@/components/Layouts";
import moment from "moment";
import Link from "next/link";

export default function Home(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const [ids, setIds] = React.useState<number[]>([]);
  const [editNoteModal, setEditNoteModal] = React.useState(false);
  const [editData, setEditData] = React.useState<{
    id?: string;
    title?: string;
    description?: string;
  }>();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data, isLoading } = useGetNotesQuery(
    graphqlRequestClient,
    { page: Number(router.query.page) },
    {
      onError(error: any) {
        if (error.response.status === 401) {
          queryClient.clear();
          router.push("/login");
        }
      },
      initialData: props.dehydratedState.queries[0].state,
      keepPreviousData: true,
    }
  );

  const deleteNote = useDeleteNoteMutation(graphqlRequestClient, {
    onSuccess(data: any) {
      toast("success delete!", {
        type: "success",
        position: "top-right",
      });
      queryClient.refetchQueries(useGetNotesQuery.getKey());
    },
  });

  const deleteNotesMany = useDeleteNotesManyMutation(graphqlRequestClient, {
    onSuccess(data: any) {
      queryClient.refetchQueries(useGetNotesQuery.getKey());
      toast(data?.deleteNotesMany.message, {
        type: "success",
        position: "top-right",
      });
      setIds([]);
    },
    onError() {
      toast("opss something wrong!!!", {
        type: "error",
        position: "top-right",
      });
    },
  });

  function openEditHandler(e: React.SyntheticEvent, data: any) {
    e.preventDefault();
    setEditNoteModal(!editNoteModal);
    setEditData(data);
  }
  function markCheckboxHandler(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.checked) {
      setIds((old) => [...old, Number(e.target.value)]);
    } else {
      setIds(ids.filter((id) => id !== Number(e.target.value)));
    }
  }
  function markAllCheckboxHandler() {
    const noteids =
      data?.getNotes?.notes?.map((note) => Number(note?.id)) || [];
    setIds(ids.concat(noteids.filter((item) => ids.indexOf(item) < 0)));
  }
  function deleteNotesManyHandler() {
    deleteNotesMany.mutate({ noteIds: ids });
  }

  return (
    <>
      <Head>
        <title>Note App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layouts>
        {isLoading && <div className="text-center">Loading....</div>}
        {data?.getNotes?.notes?.length === 0 && (
          <div className="text-center">NO NOTES</div>
        )}
        <div className="flex flex-col gap-4 pt-4 mx-4">
          <div className="flex items-center gap-4">
            <span className="font-bold text-lg">Home</span>
            <button
              className="transition duration-300 ease-in-out border border-red-500 rounded-md px-3 text-red-500 hover:bg-red-500 hover:text-white"
              onClick={markAllCheckboxHandler}
            >
              Select all
            </button>
            {ids.length > 1 && (
              <button
                className="transition duration-300 ease-in-out border border-red-500 rounded-md px-3 text-red-500 hover:bg-red-500 hover:text-white"
                onClick={() => setIds([])}
              >
                Unselect all
              </button>
            )}
            <button
              className={`transition duration-300 ease-in-out border border-red-500 rounded-md px-3 text-red-500 hover:bg-red-500 hover:text-white ${
                ids.length !== 0 ? "z-50 opacity-100" : "-z-50 opacity-0"
              }`}
              onClick={deleteNotesManyHandler}
            >
              {ids.length > 1 ? "move all to trash" : "move to trash"}
            </button>
          </div>
          {data?.getNotes?.notes?.map((note) => (
            <div
              key={note?.id}
              className="flex justify-between items-start border rounded-md p-2"
            >
              <div className="flex gap-2">
                <div>
                  <input
                    type="checkbox"
                    value={note?.id}
                    checked={ids.includes(Number(note?.id))}
                    className="accent-orange-300"
                    onChange={markCheckboxHandler}
                  />
                </div>
                <div>
                  <div className="text-medium font-bold">{note?.title}</div>
                  <div>{note?.description}</div>
                  <small className="text-gray-500">
                    {moment(Number(note?.createdAt)).format("dddd DD/MM/YYYY")}
                  </small>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="border rounded-md px-2 bg-green-500 text-white"
                  onClick={(e) => {
                    const data = note;
                    openEditHandler(e, data);
                  }}
                >
                  edit
                </button>
                <button
                  type="submit"
                  className="border rounded-md px-2 bg-red-500 text-white"
                  onClick={() =>
                    deleteNote.mutate({ noteId: Number(note?.id) })
                  }
                >
                  Move to trash
                </button>
              </div>
            </div>
          ))}
          <div className="flex gap-4 justify-center">
            <Link
              href={`?page=${data?.getNotes?.prev}`}
              className={`border px-2 rounded-md hover:shadow-md ${
                data?.getNotes?.prev === null &&
                "pointer-events-none bg-gray-200"
              }`}
            >
              <span>Prev</span>
            </Link>
            <span>{router.query.page || 1}</span>
            <Link
              href={`?page=${data?.getNotes?.next}`}
              className={`border px-2 rounded-md hover:shadow-md ${
                data?.getNotes?.next === null &&
                "pointer-events-none bg-gray-200"
              }`}
            >
              <span>Next</span>
            </Link>
          </div>
        </div>
        <EditNote
          show={editNoteModal}
          setShow={setEditNoteModal}
          data={editData}
        />
      </Layouts>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookie = ctx.req.headers.cookie as string;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(
    useGetNotesQuery.getKey({ page: Number(ctx.query.page) }),
    useGetNotesQuery.fetcher(graphqlRequest(cookie))
  );
  if (ctx.req.headers.cookie === undefined) {
    return {
      props: {},
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  return {
    props: {
      // dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
      dehydratedState: dehydrate(queryClient),
    },
  };
};
