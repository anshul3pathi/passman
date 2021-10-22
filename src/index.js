require("./db/mongoose")
const express = require("express")
const userRouter = require("./routers/user")
const secretRouter = require("./routers/secret")

const app = express()
const PORT = process.env.PORT

app.use(express.json())
app.use(userRouter)
app.use(secretRouter)

app.listen(PORT, () => {
    console.log("Listening on port", PORT)
})
