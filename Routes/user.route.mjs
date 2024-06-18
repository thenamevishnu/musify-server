import { Router } from "express"
import userController from "../Controllers/user.controller.mjs"
import { userAuth } from "../Middleware/Auth.mjs"

const appRouter = Router()

appRouter.post("/signup", userController.signup)
appRouter.get("/login", userController.login)
appRouter.get("/singers", userAuth, userController.getSingers)
appRouter.patch("/update/:user_id", userAuth, userController.updateProfile)
appRouter.patch("/password/update/:user_id", userAuth, userController.updatePassword)

export default appRouter