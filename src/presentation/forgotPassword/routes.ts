import { Router } from "express";
import { ForgotPasswordService } from "../services/forgotPassword.service";
import { ForgotPasswordController } from "./controller";
import { EmailService } from "../services/email.service";
import { envs } from "../../config";

export class ForgotPasswordRoutes {
  static get routes(): Router {
    const router = Router()

    const emailService = new EmailService(
      envs.MAILER_SERVICE,
      envs.MAILER_EMAIL,
      envs.MAILER_SECRET_KEY,
      envs.SEND_EMAIL,
    )

    const forgetPasswordService = new ForgotPasswordService( emailService )
    const controller = new ForgotPasswordController( forgetPasswordService )

    router.post('/otp', controller.sendEmailOtp)
    router.get('/verify', controller.verifyOtp)
    router.post('/reset/:id', controller.resetPassword)

    return router
  }
}
