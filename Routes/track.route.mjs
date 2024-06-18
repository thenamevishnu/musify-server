import { Router } from "express"
import trackController from "../Controllers/track.controller.mjs"
import { userAuth } from "../Middleware/Auth.mjs"

const appRouter = Router()

appRouter.post("/upload", userAuth, trackController.uploadTrack)
appRouter.get("/trendings", userAuth, trackController.getTrending)
appRouter.get("/recommend", userAuth, trackController.getRecommendations)
appRouter.get("/track/:trackId/:user_id", userAuth, trackController.getTrack)
appRouter.get("/my-tracks/:user_id", userAuth, trackController.getMyTracks)

appRouter.delete("/delete/:user_id/:track_id", userAuth, trackController.deleteTrack)

export default appRouter