import { GraphQLClient } from "graphql-request";

const GRAPHQL_ENDPOINT = "http://localhost:4000/graphql" as string;
const graphqlRequestClient = new GraphQLClient(
  "http://localhost:4000/graphql",
  {
    credentials: "include",
    mode: "cors",
  }
);

export default graphqlRequestClient;
