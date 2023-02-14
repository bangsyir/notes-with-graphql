import { GraphQLError } from "graphql";
import { conn } from "../data-source";
import { Note } from "../entity/Note";
import {
  ErrorResponse,
  validateDesc,
  validateTitle,
} from "../handler/errorHandler";
import { Auth } from "../helpers/auth";
import { MyContext } from "../type";

const noteRepository = conn.getRepository(Note);

const NoteResolver = {
  Query: {
    getNotes: async (_: any, args: any, { res, session }: MyContext) => {
      const auth = await Auth(session.sub, res);
      const notes = await conn
        .getRepository(Note)
        .createQueryBuilder("notes")
        .where("notes.user_id = :userId", { userId: auth.id })
        .orderBy("notes.created_at", "DESC")
        .getMany();
      if (!notes)
        return ErrorResponse({
          message: "you dosnt have not yet",
          status: 400,
        });
      return notes;
    },
    getDeletedNotes: async (_: any, {}: any, { res, session }: MyContext) => {
      const auth = await Auth(session.sub, res);
      const notes = await conn
        .getRepository(Note)
        .createQueryBuilder("notes")
        .withDeleted()
        .where("notes.user_id = :userId", {
          userId: auth.id,
        })
        .andWhere("notes.deleted_at IS NOT NULL")
        .getMany();
      return notes;
    },
    getNote: async (
      _: any,
      { noteId }: { noteId: number },
      { res, session }: MyContext
    ) => {
      const auth = await Auth(session.sub, res);

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
      args: { input: { title: string; description: string } },
      { res, session }: MyContext
    ) {
      const errors = {
        title: validateTitle(args.input.title) || undefined,
        description: validateDesc(args.input.description) || undefined,
      };

      if (Object.values(errors).some(Boolean)) {
        throw new GraphQLError("input error", {
          extensions: {
            http: { status: 400 },
            code: "BAD_REQUEST",
            data: errors,
          },
        });
      }

      const auth = await Auth(session.sub, res);
      const note = new Note();
      note.title = args.input.title;
      note.description = args.input.description;
      note.user = auth;
      await conn.manager.save(note);
      return { note };
    },
    async updateNote(
      _: Note,
      {
        noteId,
        title,
        description,
      }: { noteId: number; title: string; description: string },
      { res, session }: MyContext
    ) {
      // finnd the note
      const auth = await Auth(session.sub, res);

      const errors = {
        title: validateTitle(title) || undefined,
        description: validateDesc(description) || undefined,
      };

      if (Object.values(errors).some(Boolean)) {
        throw new GraphQLError("input error", {
          extensions: {
            http: { status: 400 },
            code: "BAD_REQUEST",
            data: errors,
          },
        });
      }

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
      console.log(args.noteId);
      const remove = await conn
        .getRepository(Note)
        .createQueryBuilder("notes")
        .delete()
        .where("id = :noteId", { noteId: args.noteId })
        .execute();
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
