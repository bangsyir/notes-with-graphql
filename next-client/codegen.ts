import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:4000/graphql",
  documents: "src/**/*.graphql",
  generates: {
    "src/generated/generated.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-query",
      ],
      config: {
        exposeDocument: true,
        exposeQueryKeys: true,
        exposeFetcher: true,
        fetcher: "graphql-request",
        withHook: true,
      },
    },
  },
};

export default config;
