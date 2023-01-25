import { conn } from "../data-source";
import { Note } from "../entity/Note";
import { ErrorResponse } from "../handler/errorHandler";
import { getNoteById } from "../handler/noteHandler";
import { MyContext } from "../type";

const NoteResolver = {
  Query: {
    getNotes: async (parent: Note, args: any, { req, res }: MyContext) => {
      console.log(req.cookies);
      const notes = await conn.manager.find(Note);
      return notes;
    },
    getNote: async (parent: Note, args: { id: number }) => {
      const note = await conn
        .getRepository(Note)
        .createQueryBuilder("note")
        .where("note.id = :id", { id: args.id })
        .getOne();
      return note;
    },
  },
  Mutation: {
    async addNote(parent: Note, args: { title: string; description: string }) {
      const note = new Note();
      note.title = args.title;
      note.description = args.description;
      await conn.manager.save(note);
      return note;
    },
    async editNote(
      parent: Note,
      args: { noteId: number; title: string; description: string }
    ) {
      // finnd the note
      const note = await getNoteById(args.noteId);
      if (!note) return ErrorResponse("note not found", 404, "NOT_FOUND");
      note.title = args.title;
      note.description = args.description;
      await conn.manager.save(note);
      return note;
    },
    async deletedNote(parent: Note, args: { id: number }) {},
  },
};

export default NoteResolver;
