import { ApolloServer } from '@apollo/server';
import { prismaClient } from '../lib/db';
import { User } from './user';
async function createAppoloGraphqlServer() {
    const graphQlServer = new ApolloServer({
        typeDefs: `
        ${User.typeDefs}
        type Query{
         ${User.queries}
        }

        type Mutation{
         ${User.mutations}
        }
        `,
        resolvers: {
            Query: {
               ...User.resolvers.queries,
            },
            Mutation: {
               ...User.resolvers.mutations
            }

        }
    })

    //start graphql server
    await graphQlServer.start()

    return graphQlServer
}

export default createAppoloGraphqlServer