import express from "express"
import morgan from "morgan"
import cors from "cors"

import "./Utils/cron.mjs"

import userRouter from "./Routes/user.route.mjs"
import trackRouter from "./Routes/track.route.mjs"
import statusRouter from "./Routes/status.route.mjs"

import "./Config/db.mjs"

const app = express()

app.use(cors({
    origin: "*",
    methods: "*"
}))

app.use(morgan("dev"))
 
app.use(express.json())

app.use("/api/v1/users", userRouter)
app.use("/api/v1/tracks", trackRouter)
app.use("/api/status", statusRouter)

app.listen(process.env.PORT || 8080, (err) => {
    if (err) process.exit(1)
    console.log("server running...");
})