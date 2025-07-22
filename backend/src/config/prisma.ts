import { PrismaClient } from "@prisma/client"
import "dotenv/config"

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DEV_DATABASE_URL
        }
    }
})



export default prisma

