import { conn } from "../data-source";
import { Note } from "../entity/Note";

const NoteResolver = {
  Query: {
    getNotes: async () => {
      const notes = await conn.manager.find(Note);
      return notes;
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
  },
};

export default NoteResolver;
