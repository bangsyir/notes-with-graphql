import { conn } from "../data-source";
import { Note } from "../entity/Note";

export const getNoteById = async (noteId: number) => {
  const note = await conn
    .getRepository(Note)
    .createQueryBuilder("note")
    .where("note.id = :noteId", { noteId })
    .getOne();
  return note;
};
