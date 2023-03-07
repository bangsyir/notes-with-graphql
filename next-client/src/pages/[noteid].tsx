import Layouts from "@/components/Layouts";
import { useGetNoteQuery } from "@/generated/generated";
import graphqlRequestClient from "@/request/graphqlRequestClient";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

export default function NotePage() {
  const router = useRouter();
  const { data, isLoading, error } = useGetNoteQuery(graphqlRequestClient, {
    noteId: Number(router.query.noteid),
  });
  return (
    <Layouts>
      <>
        {error && <div>error</div>}
        <div className="pt-4">
          <div className="my-4">
            <Link href={"/"} className="border p-2 rounded-md">
              Back
            </Link>
          </div>
          {isLoading && <div className="text-center pt-8">Loading...</div>}
          {data && (
            <>
              <h1 className="text-2xl font-semibold">{data.getNote?.title}</h1>
              <p>{data.getNote?.description}</p>
              <div className="flex flex-wrap gap-4">
                {data.getNote?.images?.length !== 0 &&
                  data.getNote?.images?.map((image) => (
                    <div key={image?.id}>
                      <Image
                        src={`http://localhost:4000/upload/${image?.url}`}
                        width="300"
                        height="300"
                        alt="note image"
                        className="shadow-md hover:shadow-lg"
                        loading="eager"
                      />
                    </div>
                  ))}
              </div>
            </>
          )}
        </div>
      </>
    </Layouts>
  );
}
