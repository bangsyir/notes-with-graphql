import { conn } from "../data-source";
import { Note } from "../entity/Note";

export const getNoteById = async (noteId: number, userId: string) => {
  const noteRepository = conn.getRepository(Note);
  const note = await noteRepository.findOneBy({
    id: noteId,
    user: {
      id: userId,
    },
  });
  return note;
};
