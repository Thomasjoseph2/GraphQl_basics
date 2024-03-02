import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import express from 'express';

async function Init() {
    const app = express()
    app.use(express.json())
    const graphQlServer = new ApolloServer({
        typeDefs: `type Query{
            hellow:String
            say(name:String):String
        }`,
        resolvers: {
            Query:{
                hellow:()=>`hey there im graphql`,
                say:(_,{name}:{name:String})=>`hey ${name}`
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

