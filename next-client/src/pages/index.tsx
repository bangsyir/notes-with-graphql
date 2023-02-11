import Head from "next/head";
import { GetServerSideProps } from "next";
import { useGetNotesQuery, useDeleteNoteMutation } from "@/generated/generated";
import graphqlRequestClient, {
  graphqlRequest,
} from "@/request/graphqlRequestClient";
import Navbar from "@/components/Navbar";
import AddNote from "@/components/AddNote";
import { dehydrate, QueryClient, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

export default function Home(props: any) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data, isLoading } = useGetNotesQuery(
    graphqlRequestClient,
    {},
    {
      onError(error: any) {
        if (error.response.status === 401) {
          queryClient.clear();
          router.push("/login");
        }
      },
    }
  );

  const deleteNote = useDeleteNoteMutation(graphqlRequestClient, {
    onSuccess(data: any) {
      queryClient.refetchQueries(useGetNotesQuery.getKey());
    },
  });
  if (isLoading) {
    return <div>loading...</div>;
  }

  return (
    <>
      <Head>
        <title>Next app with graphql</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container mx-auto px-4 pt-10">
        <Navbar />
        <Link href={"/edit"}>edit</Link>
        <AddNote />
        {data?.getNotes?.length === 0 && (
          <div className="text-center">NO NOTES</div>
        )}
        <div className="flex flex-col gap-4 pt-4 mx-4">
          {data?.getNotes?.map((note) => (
            <div
              key={note?.id}
              className="flex justify-between items-start border rounded-md p-2"
            >
              <div>
                <div className="text-medium font-bold">{note?.title}</div>
                <div>{note?.description}</div>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="border rounded-md px-2 bg-green-500 text-white"
                >
                  edit
                </button>
                <button
                  type="submit"
                  className="border rounded-md px-2 bg-red-500 text-white"
                  onClick={() => {
                    console.log("hai");
                    return deleteNote.mutate({ noteId: Number(note?.id) });
                  }}
                >
                  delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookie = ctx.req.headers.cookie as string;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(
    useGetNotesQuery.getKey(),
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
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
};
