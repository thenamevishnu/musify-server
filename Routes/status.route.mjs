import { Router } from "express"
import statusController from "../Controllers/status.controller.mjs"

const appRouter = Router()

appRouter.get("/", statusController.status)

export default appRouter