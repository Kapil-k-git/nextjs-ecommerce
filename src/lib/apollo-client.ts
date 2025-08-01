import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';

const httpLink = createHttpLink({
  uri: 'https://saleor-kombee.onrender.com/graphql/',
});

const authLink = setContext((_, { headers }) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;
  
  return {
    headers: {
      ...headers,
      ...(token && { authorization: `JWT ${token}` }),
      'Content-Type': 'application/json',
    }
  };
});

// Enhanced error handling for cursor and other issues
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      // Handle cursor errors specifically
      if (message.includes('cursor') && message.includes('does not exist')) {
        console.warn(`[GraphQL Cursor Error]: ${message}`);
        // These errors are often non-blocking, so we continue
        return;
      }
      
      // Handle authentication errors
      if (extensions?.code === 'UNAUTHENTICATED' || message.includes('expired')) {
        console.warn('[Auth Error]: Token expired or invalid');
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-token');
        }
        return;
      }
      
      // Log other GraphQL errors
      console.error(
        `[GraphQL Error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
    });
  }

  if (networkError) {
    console.error(`[Network Error]: ${networkError}`);
    
    // Handle specific network error
    if (networkError &&
      'statusCode' in networkError &&
      (networkError as any).statusCode === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-token');
      }
    }
  }
});

// Retry logic for transient errors
const retryLink = new RetryLink({
  delay: {
    initial: 300,
    max: Infinity,
    jitter: true
  },
  attempts: {
    max: 3,
    retryIf: (error, _operation) => {
      // Retry on cursor errors (they're often transient)
      if (error.message.includes('cursor') && error.message.includes('does not exist')) {
        console.log('Retrying request due to cursor error...');
        return true;
      }
      
      // Retry on network errors (but not auth errors)
      if (error.networkError && error.networkError.statusCode !== 401) {
        return true;
      }
      
      return false;
    }
  }
});

export const apolloClient = new ApolloClient({
  link: from([
    errorLink,    // Handle errors first
    retryLink,    // Then retry if needed
    authLink,     // Add auth headers
    httpLink      // Finally make the request
  ]),
  cache: new InMemoryCache({
    // Enhanced cache configuration
    typePolicies: {
      Query: {
        fields: {
          products: {
            // Handle cursor-based pagination better
            keyArgs: ["filter", "sortBy"],
            merge(existing, incoming, { args }) {
              // For cursor errors, prefer incoming data
              if (incoming && incoming.edges) {
                return incoming;
              }
              return existing || incoming;
            }
          }
        }
      }
    }
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all', // Return data even with errors
      notifyOnNetworkStatusChange: true,
    },
    query: {
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    }
  },
  // Add connection handling
  connectToDevTools: process.env.NODE_ENV === 'development',
});