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


export type GetNotesQuery = { __typename?: 'Query', getNotes?: Array<{ __typename?: 'Note', id: string, title?: string | null, description?: string | null } | null> | null };

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