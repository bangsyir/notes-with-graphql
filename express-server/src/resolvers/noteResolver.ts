import { conn } from "../data-source";
import { Note } from "../entity/Note";
import { ErrorResponse } from "../handler/errorHandler";
import { getNoteById } from "../handler/noteHandler";
import { Auth } from "../helpers/auth";
import { MyContext } from "../type";

const noteRepository = conn.getRepository(Note);

const NoteResolver = {
  Query: {
    getNotes: async (_: any, args: any, { session }: MyContext) => {
      const auth = await Auth(session.sub);
      const notes = await conn
        .getRepository(Note)
        .createQueryBuilder("notes")
        .where("notes.user_id = :userId", { userId: auth.id })
        .getMany();
      if (!notes)
        return ErrorResponse({
          message: "you dosnt have not yet",
          status: 400,
        });
      return notes;
    },
    getDeletedNotes: async (_: any, {}: any, { session }: MyContext) => {
      const auth = await Auth(session.sub);
      const notes = await conn
        .getRepository(Note)
        .createQueryBuilder("notes")
        .withDeleted()
        .where("notes.user_id = :userId & notes.deleted_at IS NOT NULL", {
          userId: auth.id,
        })
        .getMany();
      return notes;
    },
    getNote: async (
      _: any,
      { noteId }: { noteId: number },
      { session }: MyContext
    ) => {
      const auth = await Auth(session.sub);

      const note = await noteRepository.findOneBy({
        id: noteId,
        user: {
          id: auth.id,
        },
      });
      return note;
    },
  },
  Mutation: {
    async addNote(
      _: Note,
      args: { title: string; description: string },
      { session }: MyContext
    ) {
      const auth = await Auth(session.sub);
      const note = new Note();
      note.title = args.title;
      note.description = args.description;
      note.user = auth;
      await conn.manager.save(note);
      return note;
    },
    async updateNote(
      _: Note,
      {
        noteId,
        title,
        description,
      }: { noteId: number; title: string; description: string },
      { session }: MyContext
    ) {
      // finnd the note
      const auth = await Auth(session.sub);
      const note = await noteRepository.findOneBy({
        id: noteId,
        user: {
          id: auth.id,
        },
      });
      if (!note)
        return ErrorResponse({
          message: "note not found",
          status: 404,
          code: "NOT_FOUND",
        });
      note.title = title;
      note.description = description;
      await noteRepository.save(note);
      return note;
    },
    async deleteNote(parent: Note, args: { noteId: number }) {
      const remove = await conn
        .getRepository(Note)
        .createQueryBuilder("notes")
        .softDelete()
        .where("id = :noteId", { noteId: args.noteId })
        .execute();
      console.log(remove);
      if (remove.affected === 0) {
        return ErrorResponse({
          message: `note with id ${args.noteId} not found`,
          status: 404,
        });
      }
      return { status: "success", message: "note is deleted" };
    },
    async deleteNotePermanent(parent: Note, args: { noteId: number }) {
      const remove = await conn
        .getRepository(Note)
        .createQueryBuilder("notes")
        .delete()
        .where("id = :noteId", { noteId: args.noteId })
        .execute();
      console.log(remove);
      if (remove.affected === 0) {
        return ErrorResponse({
          message: `note with id ${args.noteId} not found`,
          status: 404,
        });
      }
      return { status: "success", message: "note is deleted" };
    },
  },
};

export default NoteResolver;
