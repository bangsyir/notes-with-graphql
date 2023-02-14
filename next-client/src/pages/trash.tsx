import Layouts from "@/components/Layouts";
import {
  useDeleteNotePermanentMutation,
  useGetDeletedNotesQuery,
  useRestoreNoteMutation,
} from "@/generated/generated";
import graphqlRequestClient from "@/request/graphqlRequestClient";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
export default function Trash() {
  const queryClient = useQueryClient();
  const { data } = useGetDeletedNotesQuery(graphqlRequestClient);

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
      <Layouts>
        <div className="font-bold pt-2 text-xl">Trash</div>
        <hr className="border-b py-2" />
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
        </div>
      </Layouts>
    </>
  );
}
