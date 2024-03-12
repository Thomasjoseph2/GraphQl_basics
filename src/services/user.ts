import { prismaClient } from "../lib/db";
import { createHmac, randomBytes } from "crypto";
import JWT from 'jsonwebtoken'

const JWT_SECRET = '$uperMan@123'
export interface createUserPayload {
    firstName: string
    lastName?: string
    email: string
    password: string
}
export interface getUserTokenPayload {
    email: string
    password: string
}
class UserService {
    public static getUserByID(id: string) {
        return prismaClient.user.findUnique({ where: { id } })
    }
    private static getUserByEmail(email: string) {
        return prismaClient.user.findUnique({ where: { email } })
    }
    private static generateHash(salt: string, password: string) {
        const hashedPassword = createHmac('sha256', salt).update(password).digest('hex').substring(0, 10)
        return hashedPassword;
    }
    public static createUser(payload: createUserPayload) {
        const { firstName, lastName, email, password } = payload
        const salt = randomBytes(32).toString();
        const hashedPassword = UserService.generateHash(salt, password)
        return prismaClient.user.create({
            data: {
                firstName,
                lastName: lastName ?? "",
                email,
                salt,
                password: hashedPassword
            }
        })
    }



    public static async getUserToken(payload: getUserTokenPayload) {
        const { email, password } = payload;
        const user = await UserService.getUserByEmail(email);

        if (!user) throw new Error('user not found')

        const userSalt = user.salt;
        const userHashPassword = UserService.generateHash(userSalt, password)

        if (userHashPassword !== user.password) {
            throw new Error('incorrect Password')
        }

        const token = JWT.sign({ id: user.id, email: user.email }, JWT_SECRET)
        return token;

    }

    public static decodeJWTToken(token: string) {
        try {
            const decodedToken = JWT.verify(token, JWT_SECRET);
            return decodedToken;
        } catch (error) {
            console.error('Error decoding token:', error);
            throw new Error('Invalid token');
        }
    }

}

export default UserService