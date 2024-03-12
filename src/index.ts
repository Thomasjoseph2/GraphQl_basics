import { expressMiddleware } from '@apollo/server/express4';
import createAppoloGraphqlServer from './graphql';
import express from 'express';
import dotenv from 'dotenv'
import UserService from './services/user';
dotenv.config()
async function Init() {
    const app = express()
    app.use(express.json())


    app.get('/', (req, res) => {
        res.json({ message: 'server started' })
    })

    const graphQlServer = await createAppoloGraphqlServer()

    app.use('/graphql', expressMiddleware(graphQlServer, {
        context: async ({ req }) => {
            //@ts-ignore
            const token = req.headers["token"]
            
            try {
                const user =  UserService.decodeJWTToken(token as string)
                console.log(user);
                return { user }
            } catch (error) {
                return {}
            }
        }
    }))


    app.listen(3000, () => {
        console.log('server started');
    })
}
Init()

