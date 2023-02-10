import {
  AddNoteMutation,
  useAddNoteMutation,
  Error,
} from "@/generated/generated";
import formReducer from "@/reducer/formReducer";
import graphqlRequestClient from "@/request/graphqlRequestClient";
import React from "react";

export default function AddNote({ setNotes }: { setNotes?: () => void }) {
  const [formData, setFormData] = React.useReducer(formReducer, {});
  const [errors, setErrors] = React.useState<Error>();
  const { isLoading, mutate } = useAddNoteMutation(graphqlRequestClient, {
    onSuccess(data: AddNoteMutation) {
      if (data?.addNote?.errors !== null) {
        setErrors(data.addNote?.errors);
      }
    },
    onError(error: any) {
      console.log({ error });
    },
  });

  async function createNoteHandler(e: React.SyntheticEvent) {
    e.preventDefault();
    mutate({
      input: { title: formData.title, description: formData.description },
    });
  }
  return (
    <div className="m-4 border rounded-md">
      <div className="p-2">
        <form action="post" onSubmit={createNoteHandler}>
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
