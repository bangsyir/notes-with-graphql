import { GraphQLClient } from 'graphql-request';
import { RequestInit } from 'graphql-request/dist/types.dom';
import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };

function fetcher<TData, TVariables extends { [key: string]: any }>(client: GraphQLClient, query: string, variables?: TVariables, requestHeaders?: RequestInit['headers']) {
  return async (): Promise<TData> => client.request({
    document: query,
    variables,
    requestHeaders
  });
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type AddNote = {
  __typename?: 'AddNote';
  errors?: Maybe<Error>;
  note?: Maybe<Note>;
};

export type Error = {
  __typename?: 'Error';
  description?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addNote?: Maybe<AddNote>;
  deleteNote?: Maybe<Response>;
  deleteNotePermanent?: Maybe<Response>;
  login?: Maybe<UserResponse>;
  register?: Maybe<RegisterResponse>;
  restoreNote?: Maybe<Scalars['Boolean']>;
  updateNote?: Maybe<Note>;
};


export type MutationAddNoteArgs = {
  input?: InputMaybe<NoteInput>;
};


export type MutationDeleteNoteArgs = {
  noteId?: InputMaybe<Scalars['Int']>;
};


export type MutationDeleteNotePermanentArgs = {
  noteId?: InputMaybe<Scalars['Int']>;
};


export type MutationLoginArgs = {
  email?: InputMaybe<Scalars['String']>;
  password?: InputMaybe<Scalars['String']>;
};


export type MutationRegisterArgs = {
  email?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  password?: InputMaybe<Scalars['String']>;
};


export type MutationRestoreNoteArgs = {
  noteId?: InputMaybe<Scalars['Int']>;
};


export type MutationUpdateNoteArgs = {
  description?: InputMaybe<Scalars['String']>;
  noteId?: InputMaybe<Scalars['Int']>;
  title?: InputMaybe<Scalars['String']>;
};

export type Note = {
  __typename?: 'Note';
  createdAt?: Maybe<Scalars['String']>;
  deletedAt?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  title?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
};

export type NoteInput = {
  description: Scalars['String'];
  title: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  getDeletedNotes?: Maybe<Array<Maybe<Note>>>;
  getMe?: Maybe<User>;
  getNote?: Maybe<Note>;
  getNotes?: Maybe<Array<Maybe<Note>>>;
  getUser?: Maybe<User>;
  logout?: Maybe<Scalars['Boolean']>;
};


export type QueryGetMeArgs = {
  userId?: InputMaybe<Scalars['ID']>;
};


export type QueryGetNoteArgs = {
  noteId?: InputMaybe<Scalars['Int']>;
};


export type QueryGetUserArgs = {
  id?: InputMaybe<Scalars['ID']>;
};

export type RegisterError = {
  __typename?: 'RegisterError';
  email?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
};

export type RegisterResponse = {
  __typename?: 'RegisterResponse';
  errors?: Maybe<RegisterError>;
  message?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
};

export type Response = {
  __typename?: 'Response';
  message?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  createdAt?: Maybe<Scalars['String']>;
  deteledAt?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
};

export type UserResponse = {
  __typename?: 'UserResponse';
  message?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
};

export type GetNotesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetNotesQuery = { __typename?: 'Query', getNotes?: Array<{ __typename?: 'Note', id: string, title?: string | null, description?: string | null, createdAt?: string | null } | null> | null };

export type GetDeletedNotesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetDeletedNotesQuery = { __typename?: 'Query', getDeletedNotes?: Array<{ __typename?: 'Note', id: string, title?: string | null, description?: string | null, createdAt?: string | null, deletedAt?: string | null } | null> | null };

export type AddNoteMutationVariables = Exact<{
  input?: InputMaybe<NoteInput>;
}>;


export type AddNoteMutation = { __typename?: 'Mutation', addNote?: { __typename?: 'AddNote', errors?: { __typename?: 'Error', title?: string | null, description?: string | null } | null, note?: { __typename?: 'Note', title?: string | null, description?: string | null } | null } | null };

export type UpdateNoteMutationVariables = Exact<{
  noteId?: InputMaybe<Scalars['Int']>;
  title?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
}>;


export type UpdateNoteMutation = { __typename?: 'Mutation', updateNote?: { __typename?: 'Note', id: string, title?: string | null, description?: string | null } | null };

export type DeleteNoteMutationVariables = Exact<{
  noteId?: InputMaybe<Scalars['Int']>;
}>;


export type DeleteNoteMutation = { __typename?: 'Mutation', deleteNote?: { __typename?: 'Response', message?: string | null, status?: string | null } | null };

export type DeleteNotePermanentMutationVariables = Exact<{
  noteId?: InputMaybe<Scalars['Int']>;
}>;


export type DeleteNotePermanentMutation = { __typename?: 'Mutation', deleteNotePermanent?: { __typename?: 'Response', status?: string | null, message?: string | null } | null };

export type RestoreNoteMutationVariables = Exact<{
  noteId?: InputMaybe<Scalars['Int']>;
}>;


export type RestoreNoteMutation = { __typename?: 'Mutation', restoreNote?: boolean | null };

export type UserQueryVariables = Exact<{ [key: string]: never; }>;


export type UserQuery = { __typename?: 'Query', getMe?: { __typename?: 'User', name?: string | null, email?: string | null, createdAt?: string | null, updatedAt?: string | null } | null };

export type LogoutQueryVariables = Exact<{ [key: string]: never; }>;


export type LogoutQuery = { __typename?: 'Query', logout?: boolean | null };

export type LoginMutationVariables = Exact<{
  email?: InputMaybe<Scalars['String']>;
  password?: InputMaybe<Scalars['String']>;
}>;


export type LoginMutation = { __typename?: 'Mutation', login?: { __typename?: 'UserResponse', user?: { __typename?: 'User', name?: string | null, email?: string | null } | null } | null };

export type RegisterMutationVariables = Exact<{
  name?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  password?: InputMaybe<Scalars['String']>;
}>;


export type RegisterMutation = { __typename?: 'Mutation', register?: { __typename?: 'RegisterResponse', status?: string | null, message?: string | null, errors?: { __typename?: 'RegisterError', name?: string | null, email?: string | null, password?: string | null } | null, user?: { __typename?: 'User', name?: string | null, email?: string | null } | null } | null };


export const GetNotesDocument = `
    query GetNotes {
  getNotes {
    id
    title
    description
    createdAt
  }
}
    `;
export const useGetNotesQuery = <
      TData = GetNotesQuery,
      TError = unknown
    >(
      client: GraphQLClient,
      variables?: GetNotesQueryVariables,
      options?: UseQueryOptions<GetNotesQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useQuery<GetNotesQuery, TError, TData>(
      variables === undefined ? ['GetNotes'] : ['GetNotes', variables],
      fetcher<GetNotesQuery, GetNotesQueryVariables>(client, GetNotesDocument, variables, headers),
      options
    );
useGetNotesQuery.document = GetNotesDocument;


useGetNotesQuery.getKey = (variables?: GetNotesQueryVariables) => variables === undefined ? ['GetNotes'] : ['GetNotes', variables];
;

useGetNotesQuery.fetcher = (client: GraphQLClient, variables?: GetNotesQueryVariables, headers?: RequestInit['headers']) => fetcher<GetNotesQuery, GetNotesQueryVariables>(client, GetNotesDocument, variables, headers);
export const GetDeletedNotesDocument = `
    query GetDeletedNotes {
  getDeletedNotes {
    id
    title
    description
    createdAt
    deletedAt
  }
}
    `;
export const useGetDeletedNotesQuery = <
      TData = GetDeletedNotesQuery,
      TError = unknown
    >(
      client: GraphQLClient,
      variables?: GetDeletedNotesQueryVariables,
      options?: UseQueryOptions<GetDeletedNotesQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useQuery<GetDeletedNotesQuery, TError, TData>(
      variables === undefined ? ['GetDeletedNotes'] : ['GetDeletedNotes', variables],
      fetcher<GetDeletedNotesQuery, GetDeletedNotesQueryVariables>(client, GetDeletedNotesDocument, variables, headers),
      options
    );
useGetDeletedNotesQuery.document = GetDeletedNotesDocument;


useGetDeletedNotesQuery.getKey = (variables?: GetDeletedNotesQueryVariables) => variables === undefined ? ['GetDeletedNotes'] : ['GetDeletedNotes', variables];
;

useGetDeletedNotesQuery.fetcher = (client: GraphQLClient, variables?: GetDeletedNotesQueryVariables, headers?: RequestInit['headers']) => fetcher<GetDeletedNotesQuery, GetDeletedNotesQueryVariables>(client, GetDeletedNotesDocument, variables, headers);
export const AddNoteDocument = `
    mutation AddNote($input: NoteInput) {
  addNote(input: $input) {
    errors {
      title
      description
    }
    note {
      title
      description
    }
  }
}
    `;
export const useAddNoteMutation = <
      TError = unknown,
      TContext = unknown
    >(
      client: GraphQLClient,
      options?: UseMutationOptions<AddNoteMutation, TError, AddNoteMutationVariables, TContext>,
      headers?: RequestInit['headers']
    ) =>
    useMutation<AddNoteMutation, TError, AddNoteMutationVariables, TContext>(
      ['AddNote'],
      (variables?: AddNoteMutationVariables) => fetcher<AddNoteMutation, AddNoteMutationVariables>(client, AddNoteDocument, variables, headers)(),
      options
    );
useAddNoteMutation.fetcher = (client: GraphQLClient, variables?: AddNoteMutationVariables, headers?: RequestInit['headers']) => fetcher<AddNoteMutation, AddNoteMutationVariables>(client, AddNoteDocument, variables, headers);
export const UpdateNoteDocument = `
    mutation UpdateNote($noteId: Int, $title: String, $description: String) {
  updateNote(noteId: $noteId, title: $title, description: $description) {
    id
    title
    description
  }
}
    `;
export const useUpdateNoteMutation = <
      TError = unknown,
      TContext = unknown
    >(
      client: GraphQLClient,
      options?: UseMutationOptions<UpdateNoteMutation, TError, UpdateNoteMutationVariables, TContext>,
      headers?: RequestInit['headers']
    ) =>
    useMutation<UpdateNoteMutation, TError, UpdateNoteMutationVariables, TContext>(
      ['UpdateNote'],
      (variables?: UpdateNoteMutationVariables) => fetcher<UpdateNoteMutation, UpdateNoteMutationVariables>(client, UpdateNoteDocument, variables, headers)(),
      options
    );
useUpdateNoteMutation.fetcher = (client: GraphQLClient, variables?: UpdateNoteMutationVariables, headers?: RequestInit['headers']) => fetcher<UpdateNoteMutation, UpdateNoteMutationVariables>(client, UpdateNoteDocument, variables, headers);
export const DeleteNoteDocument = `
    mutation DeleteNote($noteId: Int) {
  deleteNote(noteId: $noteId) {
    message
    status
  }
}
    `;
export const useDeleteNoteMutation = <
      TError = unknown,
      TContext = unknown
    >(
      client: GraphQLClient,
      options?: UseMutationOptions<DeleteNoteMutation, TError, DeleteNoteMutationVariables, TContext>,
      headers?: RequestInit['headers']
    ) =>
    useMutation<DeleteNoteMutation, TError, DeleteNoteMutationVariables, TContext>(
      ['DeleteNote'],
      (variables?: DeleteNoteMutationVariables) => fetcher<DeleteNoteMutation, DeleteNoteMutationVariables>(client, DeleteNoteDocument, variables, headers)(),
      options
    );
useDeleteNoteMutation.fetcher = (client: GraphQLClient, variables?: DeleteNoteMutationVariables, headers?: RequestInit['headers']) => fetcher<DeleteNoteMutation, DeleteNoteMutationVariables>(client, DeleteNoteDocument, variables, headers);
export const DeleteNotePermanentDocument = `
    mutation DeleteNotePermanent($noteId: Int) {
  deleteNotePermanent(noteId: $noteId) {
    status
    message
  }
}
    `;
export const useDeleteNotePermanentMutation = <
      TError = unknown,
      TContext = unknown
    >(
      client: GraphQLClient,
      options?: UseMutationOptions<DeleteNotePermanentMutation, TError, DeleteNotePermanentMutationVariables, TContext>,
      headers?: RequestInit['headers']
    ) =>
    useMutation<DeleteNotePermanentMutation, TError, DeleteNotePermanentMutationVariables, TContext>(
      ['DeleteNotePermanent'],
      (variables?: DeleteNotePermanentMutationVariables) => fetcher<DeleteNotePermanentMutation, DeleteNotePermanentMutationVariables>(client, DeleteNotePermanentDocument, variables, headers)(),
      options
    );
useDeleteNotePermanentMutation.fetcher = (client: GraphQLClient, variables?: DeleteNotePermanentMutationVariables, headers?: RequestInit['headers']) => fetcher<DeleteNotePermanentMutation, DeleteNotePermanentMutationVariables>(client, DeleteNotePermanentDocument, variables, headers);
export const RestoreNoteDocument = `
    mutation RestoreNote($noteId: Int) {
  restoreNote(noteId: $noteId)
}
    `;
export const useRestoreNoteMutation = <
      TError = unknown,
      TContext = unknown
    >(
      client: GraphQLClient,
      options?: UseMutationOptions<RestoreNoteMutation, TError, RestoreNoteMutationVariables, TContext>,
      headers?: RequestInit['headers']
    ) =>
    useMutation<RestoreNoteMutation, TError, RestoreNoteMutationVariables, TContext>(
      ['RestoreNote'],
      (variables?: RestoreNoteMutationVariables) => fetcher<RestoreNoteMutation, RestoreNoteMutationVariables>(client, RestoreNoteDocument, variables, headers)(),
      options
    );
useRestoreNoteMutation.fetcher = (client: GraphQLClient, variables?: RestoreNoteMutationVariables, headers?: RequestInit['headers']) => fetcher<RestoreNoteMutation, RestoreNoteMutationVariables>(client, RestoreNoteDocument, variables, headers);
export const UserDocument = `
    query user {
  getMe {
    name
    email
    createdAt
    updatedAt
  }
}
    `;
export const useUserQuery = <
      TData = UserQuery,
      TError = unknown
    >(
      client: GraphQLClient,
      variables?: UserQueryVariables,
      options?: UseQueryOptions<UserQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useQuery<UserQuery, TError, TData>(
      variables === undefined ? ['user'] : ['user', variables],
      fetcher<UserQuery, UserQueryVariables>(client, UserDocument, variables, headers),
      options
    );
useUserQuery.document = UserDocument;


useUserQuery.getKey = (variables?: UserQueryVariables) => variables === undefined ? ['user'] : ['user', variables];
;

useUserQuery.fetcher = (client: GraphQLClient, variables?: UserQueryVariables, headers?: RequestInit['headers']) => fetcher<UserQuery, UserQueryVariables>(client, UserDocument, variables, headers);
export const LogoutDocument = `
    query Logout {
  logout
}
    `;
export const useLogoutQuery = <
      TData = LogoutQuery,
      TError = unknown
    >(
      client: GraphQLClient,
      variables?: LogoutQueryVariables,
      options?: UseQueryOptions<LogoutQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useQuery<LogoutQuery, TError, TData>(
      variables === undefined ? ['Logout'] : ['Logout', variables],
      fetcher<LogoutQuery, LogoutQueryVariables>(client, LogoutDocument, variables, headers),
      options
    );
useLogoutQuery.document = LogoutDocument;


useLogoutQuery.getKey = (variables?: LogoutQueryVariables) => variables === undefined ? ['Logout'] : ['Logout', variables];
;

useLogoutQuery.fetcher = (client: GraphQLClient, variables?: LogoutQueryVariables, headers?: RequestInit['headers']) => fetcher<LogoutQuery, LogoutQueryVariables>(client, LogoutDocument, variables, headers);
export const LoginDocument = `
    mutation Login($email: String, $password: String) {
  login(email: $email, password: $password) {
    user {
      name
      email
    }
  }
}
    `;
export const useLoginMutation = <
      TError = unknown,
      TContext = unknown
    >(
      client: GraphQLClient,
      options?: UseMutationOptions<LoginMutation, TError, LoginMutationVariables, TContext>,
      headers?: RequestInit['headers']
    ) =>
    useMutation<LoginMutation, TError, LoginMutationVariables, TContext>(
      ['Login'],
      (variables?: LoginMutationVariables) => fetcher<LoginMutation, LoginMutationVariables>(client, LoginDocument, variables, headers)(),
      options
    );
useLoginMutation.fetcher = (client: GraphQLClient, variables?: LoginMutationVariables, headers?: RequestInit['headers']) => fetcher<LoginMutation, LoginMutationVariables>(client, LoginDocument, variables, headers);
export const RegisterDocument = `
    mutation Register($name: String, $email: String, $password: String) {
  register(name: $name, email: $email, password: $password) {
    status
    message
    errors {
      name
      email
      password
    }
    user {
      name
      email
    }
  }
}
    `;
export const useRegisterMutation = <
      TError = unknown,
      TContext = unknown
    >(
      client: GraphQLClient,
      options?: UseMutationOptions<RegisterMutation, TError, RegisterMutationVariables, TContext>,
      headers?: RequestInit['headers']
    ) =>
    useMutation<RegisterMutation, TError, RegisterMutationVariables, TContext>(
      ['Register'],
      (variables?: RegisterMutationVariables) => fetcher<RegisterMutation, RegisterMutationVariables>(client, RegisterDocument, variables, headers)(),
      options
    );
useRegisterMutation.fetcher = (client: GraphQLClient, variables?: RegisterMutationVariables, headers?: RequestInit['headers']) => fetcher<RegisterMutation, RegisterMutationVariables>(client, RegisterDocument, variables, headers);