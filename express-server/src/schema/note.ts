const Note = `#graphql

  scalar Upload
  type Note {
    id: ID!
    title: String
    description: String
    createdAt: String
    updatedAt: String
    deletedAt: String
  }
  type NotesResponse {
    page: Int
    count: Int 
    next: Int 
    prev: Int
    notes: [Note]
  }
  type Response {
    status: String,
    message: String
  }

  type Query {
    getNotes(page: Int, next: Int, prev: Int, keyword: String): NotesResponse
    getNote(noteId: Int): Note
    getDeletedNotes(page: Int, next: Int, prev: Int, keyword: String): NotesResponse
  }
  input NoteInput {
    title: String!
    description: String!
  }
  type Error {
    title: String 
    description: String
  }

  type AddNote {
    note: Note
    errors: Error
  }
  type Mutation {
    addNote(input:NoteInput, files: [Upload]): AddNote
    updateNote(noteId: Int, title: String, description: String): Note
    deleteNote(noteId: Int): Response
    deleteNotesMany(noteIds:[Int]): Response
    deleteNotePermanent(noteId: Int):Response
    deleteNotesManyPermanent(noteIds: [Int]):Response
    restoreAllNotes(noteIds: [Int]): Response
    restoreNote(noteId: Int):Boolean

    singleUpload(file: Upload!): Response
  }
`;
export default Note;
