import { Router } from "express"
import adminController from "../Controllers/admin.controller.mjs"
import { adminAuth } from "../Middleware/Auth.mjs"

const appRouter = Router()

appRouter.get("/login", adminController.login)
appRouter.get("/stat", adminAuth, adminController.getStat)
appRouter.get("/users", adminAuth, adminController.usersList)
appRouter.patch("/block-unblock", adminAuth, adminController.blockOrUnblock)

appRouter.get("/tracks", adminAuth, adminController.tracksList)
appRouter.delete("/delete/track/:user_id/:track_id", adminAuth, adminController.deleteTrack)

export default appRouter