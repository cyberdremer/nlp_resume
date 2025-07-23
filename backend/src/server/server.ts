import express from "express"
import logger from "../middleware/logger"
import toplevelRouter from "../routers/toplevel"
import "dotenv/config"

const app = express()
app.set("trust proxy", 1)

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use(logger)
app.use(toplevelRouter)
app.listen(process.env.SERVER_PORT, () => {
    console.log("Listening on port 4000")
})


export default app
