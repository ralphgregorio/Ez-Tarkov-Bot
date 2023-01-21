import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client/core";
import 'dotenv/config';
import fetch from "cross-fetch";

export const apolloClient = new ApolloClient({
  link: new HttpLink({ uri: process.env.PRODUCTION_GRAPHQL_URL, fetch }),
  cache: new InMemoryCache(),
});
