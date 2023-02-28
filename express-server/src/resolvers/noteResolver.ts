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
import { finished } from "stream/promises";
import { join } from "path";
import { Image } from "../entity/Image";

const NoteResolver = {
  Query: {
    getNotes: async (
      _: any,
      { page }: { page: number },
      { res, session }: MyContext
    ) => {
      const auth = await Auth(session.sub, res);
      var take = 5;
      var page = page ? page : 1;
      var skip = (page - 1) * take;
      const notes = await Note.find({
        where: { user: { id: auth.id } },
        take: take,
        skip: skip,
        order: { createdAt: "DESC" },
        relations: {
          images: true,
        },
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
    getDeletedNotes: async (
      _: any,
      { page }: { page: number },
      { res, session }: MyContext
    ) => {
      const auth = await Auth(session.sub, res);
      var take = 5;
      var page = page ? page : 1;
      var skip = (page - 1) * take;

      const notes = await Note.find({
        where: { user: { id: auth.id }, deletedAt: Not(IsNull()) },
        take: take,
        skip: skip,
        order: { createdAt: "DESC" },
        withDeleted: true,
      });
      const count = await Note.count({
        where: { user: { id: auth.id }, deletedAt: Not(IsNull()) },
        order: { createdAt: "DESC" },
        withDeleted: true,
      });
      const pageCount = Math.ceil(count / take);
      var next = pageCount > page ? page + 1 : null;
      var prev = page > 1 ? page - 1 : null;
      return { page, count, next, prev, notes };
    },
    getNote: async (
      _: any,
      { noteId }: { noteId: number },
      { res, session }: MyContext
    ) => {
      const auth = await Auth(session.sub, res);

      const note = await Note.findOne({
        relations: {
          images: true,
        },
        where: {
          id: noteId,
          user: {
            id: auth.id,
          },
        },
      });
      return note;
    },
  },
  Upload: require("graphql-upload-ts").GraphQLUpload,
  Mutation: {
    async addNote(
      _: Note,
      args: { input: { title: string; description: string }; files: any },
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

      try {
        for (var i = 0; i < args.files.length; i++) {
          const { createReadStream, filename } = await args.files[i];
          const stream = createReadStream();
          const name = `${Math.floor(Math.random() * 10000 + 1)}-${Date.now()}`;
          const url = join(__dirname, `../../public/upload/${name}.jpg`);

          const out = require("fs").createWriteStream(url);
          await stream.pipe(out);
          await finished(out);

          const image = new Image();
          image.url = `${name}.jpg`;
          image.note = note;
          await image.save();
        }
      } catch (err) {
        console.log("File upload failed", err);
        return { status: "failed" };
      }
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
    async deleteNotesMany(
      _: any,
      args: { noteIds: number[] },
      { res, session }: MyContext
    ) {
      const auth = await Auth(session.sub, res);
      const ids = args.noteIds;
      const deleteMany = await conn
        .createQueryBuilder()
        .softDelete()
        .from(Note)
        .where("user_id = :userId", { userId: auth.id })
        .andWhere("id IN (:...id)", { id: ids })
        .execute();

      if (deleteMany.affected === 0) {
        return ErrorResponse({
          message: `opss some id is not found`,
          status: 400,
        });
      }
      return {
        status: "success",
        message: "all notes selected success deleted",
      };
    },
    async deleteNotePermanent(parent: Note, args: { noteId: number }) {
      const images = await Image.find({
        relations: { note: true },
        withDeleted: true,
        where: [
          {
            note: {
              id: args.noteId,
            },
          },
        ],
      });
      if (images.length !== 0) {
        images.map((image) => {
          require("fs").unlinkSync(
            join(__dirname, `../../public/upload/${image.url}`)
          );
        });
      }
      const remove = await Note.delete({
        id: args.noteId,
      });
      if (remove.affected === 0) {
        return ErrorResponse({
          message: `note with id ${args.noteId} not found`,
          status: 400,
        });
      }

      return { status: "success", message: "note is deleted" };
    },
    async deleteNotesManyPermanent(
      _: any,
      { noteIds }: { noteIds: number },
      { res, session }: MyContext
    ) {
      const auth = await Auth(session.sub, res);
      const images = await Image.find({
        withDeleted: true,
        where: { note: { id: noteIds } },
      });

      if (images.length !== 0) {
        images.map((image) => {
          // (__dirname, `../../public/upload/${name}.jpg`);
          require("fs").unlinkSync(
            join(__dirname, `../../public/upload/${image.url}`)
          );
        });
      }
      const remove = await conn
        .createQueryBuilder()
        .delete()
        .from(Note)
        .where("user_id = :userId", { userId: auth.id })
        .andWhere("id IN (:...ids)", { ids: noteIds })
        .execute();

      if (remove.affected === 0) {
        return ErrorResponse({
          message: `opss some id is not found`,
          status: 400,
        });
      }
      return {
        status: "success",
        message: "all notes successfull remove permanently",
      };
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
    async restoreAllNotes(
      _: any,
      { noteIds }: { noteIds: number[] },
      { res, session }: MyContext
    ) {
      const auth = await Auth(session.sub, res);
      const restoreAll = await conn
        .createQueryBuilder()
        .restore()
        .from(Note)
        .where("user_id = :userId", { userId: auth.id })
        .andWhere("id IN(:...ids)", { ids: noteIds })
        .execute();
      if (restoreAll.affected === 0) {
        return ErrorResponse({
          message: `opss some id is not found`,
          status: 400,
        });
      }
      return { status: "success", message: "all selected note is restored" };
    },
    async singleUpload(_: any, { file }: { file: any }) {
      console.log(join(__dirname));
      const { createReadStream } = await file;
      const stream = createReadStream();
      const name = Math.floor(Math.random() * 10000 + 1);
      const url = join(
        __dirname,
        `../../public/upload/${name}-${Date.now()}.jpg`
      );
      const out = require("fs").createWriteStream(url);
      await stream.pipe(out);
      await finished(out);
      // console.log(out);
      return { status: "success" };
    },
  },
};

export default NoteResolver;
