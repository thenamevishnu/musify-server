import { Router } from "express"
import trackController from "../Controllers/track.controller.mjs"
import { Auth } from "../Middleware/Auth.mjs"

const appRouter = Router()

appRouter.post("/upload", Auth, trackController.uploadTrack)

export default appRouter