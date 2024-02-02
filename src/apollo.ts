import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';


const client = new ApolloClient({
    uri: 'https://rickandmortyapi.com/graphql',
    cache: new InMemoryCache(),
  });

const getResult = (queryString:string) => {
    return new Promise((resolve,reject)=>{
        client
        .query({
          query: gql`
            ${queryString}
          `,
        })
        .then((result) => resolve(result)).catch((err)=>reject(err));
    })
}

export {getResult};

export default client;

