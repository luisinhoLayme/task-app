import { Router } from "express";
import { AuthController } from "./controller";
import { AuthService } from "../services/auth.service";
import { GoogleMiddleware } from "../middleware/googleToken.middleware";

export class AuthRoutes {
  static get routes(): Router {
    const router = Router()

    const authService = new AuthService()
    const controller = new AuthController(authService)

    router.post('/login', controller.loginUser)
    router.post('/register', controller.registerUser)
    router.post('/google', GoogleMiddleware.validateGoogleToken, controller.googleSignIn)
    router.post('/refresh', controller.refreshTokenUser)
    router.get('/validate-email/:token', controller.validateEmail)
    router.post('/logout', controller.logout)

    return router
  }
}