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
  type RegisterError {
    name:String
    email: String 
    password: String
  }
  type RegisterResponse {
    status: String 
    message: String 
    user: User 
    errors: RegisterError
  }

  type Query {
    getUser(id: ID) : User
    getMe(userId: ID): User
    logout:Boolean
  }
  type Mutation {
    register(name: String, email: String, password:String): RegisterResponse
    login(email: String, password: String): UserResponse
  }
`;

export default User;
