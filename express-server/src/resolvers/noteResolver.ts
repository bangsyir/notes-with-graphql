import { GraphQLError } from "graphql";
import { IsNull, Not } from "typeorm";
import { conn } from "../data-source";
import { Note } from "../entity/Note";
import {
  ErrorResponse,
  validateDesc,
  validateTitle,
} from "../handler/errorHandler";
import { Auth } from "../helpers/auth";
import { MyContext } from "../type";

const NoteResolver = {
  Query: {
    getNotes: async (
      _: any,
      { take, page, skip }: { take: number; page: number; skip: number },
      { res, session }: MyContext
    ) => {
      const auth = await Auth(session.sub, res);
      var take = take || 5;
      var page = page ? page : 1;
      var skip = (page - 1) * take;
      const notes = await Note.find({
        where: { user: { id: auth.id } },
        take: take,
        skip: skip,
        order: { createdAt: "DESC" },
      });
      const count = await Note.count({
        where: {
          user: { id: auth.id },
        },
      });
      const pageCount = Math.ceil(count / take);
      var next = pageCount > page ? page + 1 : null;
      var prev = page > 1 ? page - 1 : null;
      if (!notes)
        return ErrorResponse({
          message: "you dosnt have not yet",
          status: 400,
        });
      return { page, count, next, prev, notes };
    },
    getDeletedNotes: async (_: any, {}: any, { res, session }: MyContext) => {
      const auth = await Auth(session.sub, res);
      const notes = await Note.find({
        where: { user: { id: auth.id }, deletedAt: Not(IsNull()) },
        order: { createdAt: "DESC" },
        withDeleted: true,
      });
      return notes;
    },
    getNote: async (
      _: any,
      { noteId }: { noteId: number },
      { res, session }: MyContext
    ) => {
      const auth = await Auth(session.sub, res);

      const note = await Note.findOneBy({
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
      await note.save();
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
        title: validateTitle(title),
        description: validateDesc(description),
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

      const note = await Note.findOneBy({
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
      await note.save();
      return note;
    },
    async deleteNote(parent: Note, args: { noteId: number }) {
      const remove = await conn
        .getRepository(Note)
        .createQueryBuilder("notes")
        .softDelete()
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
    async deleteNotePermanent(parent: Note, args: { noteId: number }) {
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
    async restoreNote(_: any, { noteId }: { noteId: number }) {
      const restore = await conn
        .getRepository(Note)
        .createQueryBuilder("note")
        .restore()
        .where("id = :id", { id: noteId })
        .execute();
      if (restore.affected === 0) {
        return ErrorResponse({
          message: `note with id ${noteId} not found`,
          status: 404,
        });
      }
      return true;
    },
  },
};

export default NoteResolver;
