const User = `#graphql
  type User {
    id: ID
    name: String
    email: String
    password: String 
    createdAt: String 
    updatedAt: String 
    deteledAt: String
  }
  type UserResponse {
    status: String 
    message: String 
    user: User
  }
  type Query {
    getUser(id: ID) : User
    getMe(userId: ID): User
  }
  type Mutation {
    register(name: String, email: String, password:String): User
    login(email: String, password: String): UserResponse
  }
`;

export default User;
