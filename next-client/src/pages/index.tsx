import Head from "next/head";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useGetNotesQuery } from "@/generated/generated";
import graphqlRequestClient from "@/request/graphqlRequestClient";

export default function Home() {
  const router = useRouter();
  const { isLoading, isError, error, data } =
    useGetNotesQuery(graphqlRequestClient);
  return (
    <>
      <Head>
        <title>Next app with graphql</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {data?.getNotes?.length === 0 && <div>NO NOTES</div>}
        {data?.getNotes?.map((note) => (
          <div key={note?.id}>
            <div className="text-medium">{note?.title}</div>
          </div>
        ))}
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  if (ctx.req.headers.cookie === undefined) {
    return {
      props: {},
      redirect: {
        destination: "/login",
        permanent: true,
      },
    };
  }
  return {
    props: {},
  };
};
