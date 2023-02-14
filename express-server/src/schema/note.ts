const Note = `#graphql
  type Note {
    id: ID!
    title: String
    description: String
    createdAt: String
    updatedAt: String
    deletedAt: String
  }
  type Response {
    status: String,
    message: String
  }

  type Query {
    getNotes: [Note]
    getNote(noteId: Int): Note
    getDeletedNotes: [Note]
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
    addNote(input:NoteInput): AddNote
    updateNote(noteId: Int, title: String, description: String): Note
    deleteNote(noteId: Int): Response
    deleteNotePermanent(noteId: Int):Response
    restoreNote(noteId: Int):Boolean
  }
`;
export default Note;
