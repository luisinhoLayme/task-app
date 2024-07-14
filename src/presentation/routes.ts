import { Router } from "express";
import { TaskRoutes } from "./task/router";
import { AuthRoutes } from "./auth/routes";
import { ForgotPasswordRoutes } from "./forgotPassword/routes";

export class AppRouter {
  static get routes(): Router {
    const router = Router()

    router.use('/api/tasks', TaskRoutes.routes)
    router.use('/api/auth', AuthRoutes.routes)
    router.use('/api/password', ForgotPasswordRoutes.routes)

    return router
  }

}
