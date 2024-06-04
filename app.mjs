import express from "express"
import morgan from "morgan"
import userRouter from "./Routes/user.route.mjs"
import "./Config/db.mjs"

const app = express()

app.use(morgan("dev"))

app.use(express.json())

app.use("/api/v1/user", userRouter)

app.listen(process.env.PORT || 8080, (err) => {
    if (err) process.exit(1)
    console.log("server running...");
})