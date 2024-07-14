import { Request, Response } from "express";
import { ForgotPasswordService } from "../services/forgotPassword.service";
import { EmailDto, HandleError, OtpDto, ResetPasswordDto } from "../../domain";

export class ForgotPasswordController {
  constructor(
    private readonly forgotPasswordService: ForgotPasswordService
  ) {}

  public sendEmailOtp = (req: Request, res: Response) => {
    const [ error, emailDto ] = EmailDto.create( req.body )
    if ( error ) return res.status(400).json({ error })

    this.forgotPasswordService.sendEmailOtp(emailDto!)
      .then(result => res.json(result))
      .catch(error => HandleError.error(error, res))
  }

  public verifyOtp = (req: Request, res: Response) => {
    const [ error, otpDto ] = OtpDto.create( { otp: req.query.otp } )
    if ( error ) return res.status(400).json({ error })

    this.forgotPasswordService.verifyOtp( otpDto! )
      .then(result => res.json(result))
      .catch(error => HandleError.error(error, res))
  }

  public resetPassword = (req: Request, res: Response) => {
    const [ error, resetPasswordDto ] = ResetPasswordDto.create( req.body )
    if ( error ) return res.status(400).json({ error })

    this.forgotPasswordService.resetPassword( resetPasswordDto!, req.params.id )
      .then(result => res.json(result))
      .catch(error => HandleError.error(error, res))
  }
}
