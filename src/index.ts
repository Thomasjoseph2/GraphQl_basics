import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv'
import { prismaClient } from './lib/db';
dotenv.config()
async function Init() {
    const app = express()
    app.use(express.json())
    const graphQlServer = new ApolloServer({
        typeDefs: `
        type Query{
            hellow:String
            say(name:String):String
        }

        type Mutation{
            createUser(firstName:String!, lastName:String!,email:String! ,password:String!):Boolean
        }
    
        `,
        resolvers: {
            Query: {
                hellow: () => `hey there im graphql`,
                say: (_, { name }: { name: String }) => `hey ${name}`
            },
            Mutation: {
                createUser: async (_, { firstName, lastName, email, password }: { firstName: string, lastName: string, email: string, password: string }) => {
                    await prismaClient.user.create({
                        data: {
                            email,
                            firstName,
                            lastName,
                            password,
                            salt: 'random_salt'
                        }
                    })
                    return true
                }
            }

        }
    })

    //start graphql server
    await graphQlServer.start()

    app.get('/', (req, res) => {
        res.json({ message: 'server started' })
    })

    app.use('/graphql', expressMiddleware(graphQlServer))


    app.listen(3000, () => {
        console.log('server started');
    })
}
Init()

