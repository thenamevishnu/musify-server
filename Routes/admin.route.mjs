import { Router } from "express"
import adminController from "../Controllers/admin.controller.mjs"
import { adminAuth } from "../Middleware/Auth.mjs"

const appRouter = Router()

appRouter.get("/login", adminController.login)
appRouter.get("/stat", adminAuth, adminController.getStat)
appRouter.get("/users", adminAuth, adminController.usersList)
appRouter.patch("/block-unblock", adminAuth, adminController.blockOrUnblock)

appRouter.get("/tracks", adminAuth, adminController.tracksList)
appRouter.get("/tracks/requests", adminAuth, adminController.trackRequests)
appRouter.patch("/tracks/approve", adminAuth, adminController.trackApprove)
appRouter.delete("/delete/track/:user_id/:track_id", adminAuth, adminController.deleteTrack)
appRouter.get("/reports", adminAuth, adminController.reports)

export default appRouter