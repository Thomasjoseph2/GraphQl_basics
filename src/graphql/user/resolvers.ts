import { prismaClient } from "../../lib/db"
const queries = {}

const mutations = {
    createUser: async (_:any, { firstName, lastName, email, password }: { firstName: string, lastName: string, email: string, password: string }) => {
        await prismaClient.user.create({
            data: {
                email,
                firstName,
                lastName,
                password,
                salt: 'random_salt'
            }
        })
        return  
    }
}


export const resolvers = { queries, mutations }