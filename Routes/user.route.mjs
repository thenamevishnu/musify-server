import { Router } from "express"
import userController from "../Controllers/user.controller.mjs"

const appRouter = Router()

appRouter.post("/", userController.signup)
appRouter.get("/", userController.login)

export default appRouter