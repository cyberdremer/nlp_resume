import { PrismaClient } from "@prisma/client"
import "dotenv/config"


const dbUrl = process.env.NODE_ENV === "dev" ? process.env.DEV_DATABASE_URL : process.env.TEST_DATABASE_URL

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: dbUrl
        }
    }
})



export default prisma

