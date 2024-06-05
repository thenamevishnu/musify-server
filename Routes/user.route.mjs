import { Router } from "express"
import userController from "../Controllers/user.controller.mjs"

const appRouter = Router()

appRouter.post("/signup", userController.signup)
appRouter.get("/login", userController.login)
appRouter.get("/singers", userController.getSingers)

export default appRouter