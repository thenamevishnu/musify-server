import { Router } from "express"
import trackController from "../Controllers/track.controller.mjs"
import { Auth } from "../Middleware/Auth.mjs"

const appRouter = Router()

appRouter.post("/upload", Auth, trackController.uploadTrack)
appRouter.get("/trendings", Auth, trackController.getTrending)
appRouter.get("/recommend", Auth, trackController.getRecommendations)
appRouter.get("/track/:trackId/:user_id", Auth, trackController.getTrack)

export default appRouter