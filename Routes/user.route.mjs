import { Router } from "express"
import userController from "../Controllers/user.controller.mjs"

const appRouter = Router()

appRouter.post("/signup", userController.signup)
appRouter.get("/login", userController.login)
appRouter.get("/singers", userController.getSingers)
appRouter.patch("/update/:user_id", userController.updateProfile)
appRouter.patch("/password/update/:user_id", userController.updatePassword)

export default appRouter