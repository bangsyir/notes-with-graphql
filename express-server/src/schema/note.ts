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
  type Mutation {
    addNote(title: String, description:String): Note
    updateNote(noteId: Int, title: String, description: String): Note
    deleteNote(noteId: Int): Response
    deleteNotePermanent(noteId: Int):Response
  }
`;
export default Note;
