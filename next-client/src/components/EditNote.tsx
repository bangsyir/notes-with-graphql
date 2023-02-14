import { useGetNotesQuery, useUpdateNoteMutation } from "@/generated/generated";
import formReducer from "@/reducer/formReducer";
import graphqlRequestClient from "@/request/graphqlRequestClient";
import { useQueryClient } from "@tanstack/react-query";
import React, { useReducer, useRef } from "react";
import { toast } from "react-toastify";

export default function EditNote({
  show,
  setShow,
  data,
}: {
  show: boolean;
  setShow: (value: boolean) => void;
  data: any;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useReducer(formReducer, {});
  const queryClient = useQueryClient();
  const { isLoading, mutate, error } = useUpdateNoteMutation(
    graphqlRequestClient,
    {
      onSuccess() {
        queryClient.refetchQueries(useGetNotesQuery.getKey());
        setShow(false);
        formRef.current?.reset();
        toast("update success!", {
          type: "success",
          position: "top-right",
        });
      },
    }
  );
  function editSubmitHandler(e: React.SyntheticEvent) {
    e.preventDefault();
    mutate({
      noteId: Number(data.id),
      title: formData.title || data.title,
      description: formData.description || data.description,
    });
  }
  function closeEditModal() {
    setShow(false);
    formRef.current?.reset();
  }
  const errorSubmit = error as any;
  return (
    <div
      className={`flex items-center justify-center ${
        show ? "visible" : "invisible"
      }`}
    >
      <div className="fixed inset-0 top-0 bg-gray-600 bg-opacity-50"></div>
      <div className="border rounded-md w-1/2 p-4 absolute top-1/4 bg-white shadow-lg">
        <div className="flex justify-between items-center pb-2">
          <span className="font-bold">Edit note</span>
          <button onClick={closeEditModal}>x</button>
        </div>
        <form action="post" onSubmit={editSubmitHandler} ref={formRef}>
          <div className="grid gap-4">
            <input
              type="text"
              name="title"
              id="title"
              className="border rounded-md p-2 focus:outline-cyan-400"
              placeholder="Title input"
              defaultValue={data?.title}
              onInput={setFormData}
            />
            {!isLoading &&
              error &&
              errorSubmit?.response?.errors[0].extensions.data.title && (
                <small className="text-red-500">
                  {errorSubmit?.response?.errors[0].extensions.data.title}
                </small>
              )}
            <textarea
              name="description"
              id="description"
              cols={10}
              rows={3}
              placeholder="Description input"
              className="border rounded-md p-2 focus:outline-cyan-400"
              defaultValue={data?.description}
              onInput={setFormData}
            ></textarea>
            {!isLoading &&
              error &&
              errorSubmit?.response?.errors[0].extensions.data.description && (
                <small className="text-red-500">
                  {errorSubmit?.response?.errors[0].extensions.data.description}
                </small>
              )}
          </div>
          <div className="p-2 text-right">
            <button className="border rounded-md px-4 py-2 bg-cyan-500 text-white">
              submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
