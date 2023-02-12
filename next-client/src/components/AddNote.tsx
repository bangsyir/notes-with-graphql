import {
  AddNoteMutation,
  useAddNoteMutation,
  Error,
  useGetNotesQuery,
} from "@/generated/generated";
import formReducer from "@/reducer/formReducer";
import graphqlRequestClient from "@/request/graphqlRequestClient";
import { useQueryClient } from "@tanstack/react-query";
import React, { FormEvent, useRef } from "react";
import { toast } from "react-toastify";

export default function AddNote({
  addNoteModal,
  setAddNoteModal,
}: {
  addNoteModal: boolean;
  setAddNoteModal: (value: boolean) => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = React.useReducer(formReducer, {});
  const [errors, setErrors] = React.useState<Error>();
  const queryClient = useQueryClient();
  const { isLoading, mutate } = useAddNoteMutation(graphqlRequestClient, {
    onSuccess(data: AddNoteMutation) {
      console.log(data);
      toast("note is success to create!", {
        type: "success",
        position: "top-right",
      });
      queryClient.refetchQueries(useGetNotesQuery.getKey());
      setAddNoteModal(false);
      formRef.current?.reset();
    },
    onError(error: any) {
      console.log({ error });
    },
  });

  function createNoteHandler(e: FormEvent) {
    e.preventDefault();
    mutate({
      input: { title: formData.title, description: formData.description },
    });
  }
  return (
    <div
      className={`flex items-center justify-center ${
        addNoteModal === true ? "visible" : "invisible"
      }`}
    >
      <div className="fixed inset-0 top-0 bg-gray-600 bg-opacity-50"></div>
      <div className="border rounded-md w-1/2 p-4 absolute top-1/4 bg-white shadow-lg">
        <div className="flex justify-between items-center pb-2">
          <span className="font-bold">Add note</span>
          <button onClick={() => setAddNoteModal(false)}>x</button>
        </div>
        <form action="post" onSubmit={createNoteHandler} ref={formRef}>
          <div className="grid gap-4">
            <input
              type="text"
              name="title"
              id="title"
              className="border rounded-md p-2 focus:outline-cyan-400"
              placeholder="Title input"
              onChange={setFormData}
            />
            {!isLoading && errors && errors.title && (
              <small className="text-red-500">{errors.title}</small>
            )}
            <textarea
              name="description"
              id="description"
              cols={10}
              rows={3}
              placeholder="Description input"
              className="border rounded-md p-2 focus:outline-cyan-400"
              onChange={setFormData}
            ></textarea>
            {!isLoading && errors && errors.description && (
              <small className="text-red-500">{errors.description}</small>
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
