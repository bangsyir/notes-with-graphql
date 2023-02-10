import { GraphQLClient } from "graphql-request";

const GRAPHQL_ENDPOINT = "http://localhost:4000/graphql" as string;
const graphqlRequestClient = new GraphQLClient(
  "http://localhost:4000/graphql",
  {
    // jsonSerializer: {
    //   parse: JSON.parse,
    //   stringify: JSON.stringify,
    // },
    credentials: "include",
    mode: "cors",
  }
);

export const graphqlRequest = (cookie: string) =>
  new GraphQLClient("http://localhost:4000/graphql", {
    headers: {
      Cookie: cookie,
    },
  });

export default graphqlRequestClient;
