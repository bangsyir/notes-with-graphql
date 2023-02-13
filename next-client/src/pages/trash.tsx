import Layouts from "@/components/Layouts";
import { useGetDeletedNotesQuery } from "@/generated/generated";
import graphqlRequestClient from "@/request/graphqlRequestClient";

export default function Trash() {
  const { data } = useGetDeletedNotesQuery(graphqlRequestClient);
  return (
    <>
      <Layouts>
        <div>Trash</div>
        <div className="grid gap-4">
          {data?.getDeletedNotes?.length === 0 && (
            <div className="text-center">NO NOTES</div>
          )}
          {data?.getDeletedNotes?.map((note) => (
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
                  onClick={(e) => {
                    const data = note;
                  }}
                >
                  restore
                </button>
                <button
                  type="submit"
                  className="border rounded-md px-2 bg-red-500 text-white"
                >
                  delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </Layouts>
    </>
  );
}
