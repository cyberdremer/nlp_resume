import express from "express"
import toplevelRouter from "../routers/toplevel"

const app = express()
app.set("trust proxy", 1)

app.use(express.urlencoded({extended: true}))
app.use(express.json())


app.use(toplevelRouter)
app.listen(4000, () => {
    console.log("Listening on port 4000")
})
