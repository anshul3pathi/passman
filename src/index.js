require("./db/mongoose")
const express = require("express")
const userRouter = require("./routers/user")

const app = express()
const PORT = process.env.PORT

app.use(express.json())
app.use(userRouter)

app.listen(PORT, () => {
    console.log("Listening on port", PORT)
})
