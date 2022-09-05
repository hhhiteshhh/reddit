import { ApolloClient, InMemoryCache } from '@apollo/client'

const client = new ApolloClient({
  uri: 'https://mechelen.stepzen.net/api/operatic-shark/__graphql',
  headers: {
    Authorization: `apikey ${process.env.NEXT_PUBLIC_STEPZEN_KEY}`,
  },
  cache: new InMemoryCache(),
})

export default client
