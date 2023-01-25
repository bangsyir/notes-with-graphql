const Note = `#graphql
  type Note {
    id: ID!
    title: String
    description: String
    createdAt: String
    updatedAt: String
    deletedAt: String
  }

  type Query {
    getNotes: [Note]
    getNote(id: ID): Note
  }
  type Mutation {
    addNote(title: String, description:String): Note
    updateNote(title: String, description: String): Note
  }
`;
export default Note;
