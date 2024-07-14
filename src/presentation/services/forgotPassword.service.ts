import { Bcrypt, OTP, validate } from "../../config";
import { UserModel, OtpModel } from "../../data/mongo";
import { CustomError, EmailDto, OtpDto, ResetPasswordDto } from "../../domain";
import { EmailService } from "./email.service";

export class ForgotPasswordService {

  constructor(
    private readonly emailService: EmailService
  ) {}

  private async sendEmailPasswordResetLink(email: string, otp: string) {
    const html = `
      <h2>Task App - Password Reset</h2>
      <p>Your OTP code (It is expired after 10 min): <strong>${otp}</strong></p>
    `
    const options = {
      to: email,
      subject: 'Password Reset OTP Code',
      htmlBody: html,
    }

    const isSent = await this.emailService.sendEmail(options)
    if (!isSent) throw CustomError.internalServer('Error sending email')

    return true
  }

  public async sendEmailOtp(emailDto: EmailDto) {

    const user = await UserModel.findOne({ email: emailDto.email })
    if (!user) throw CustomError.badRequest('User with email does not exists.')


    try {
      let otp = await OtpModel.findOne({ userId: user.id })
      if (!otp) {
        const data = {
          userId: user.id,
          otp: OTP.generate(),
          otpExpiration: new Date(Date.now() + 10 * 60 * 1000)
        }

        otp = new OtpModel(data)
        await otp.save()
      }

      if (!otp.otp || !otp.otpExpiration || new Date() > new Date(otp.otpExpiration)) {
        otp.otp = OTP.generate()
        otp.otpExpiration = new Date(Date.now() + 10 * 60 * 1000)
        await otp.save()
      }

      await this.sendEmailPasswordResetLink(emailDto.email, otp.otp)

      return {
        message: 'Your OTP send to the email.'
      }
    } catch (err) {
      console.log(err)
      throw CustomError.internalServer('Internal server error.')
    }
  }

  public async verifyOtp(otpDto: OtpDto) {

    const otpCode = await OtpModel.findOne({ otp: otpDto.otp })
    if (!otpCode) throw CustomError.badRequest('Invalid OTP Code')

    const user = await UserModel.findById(otpCode.userId)
    if (!user) throw CustomError.badRequest('Invalid OTP code')

    const OTPExpired = new Date() > new Date(otpCode.otpExpiration!)
    if (OTPExpired) throw CustomError.badRequest('OTP is Expired')

    return {
      userId: otpCode.userId,
      message: 'Valid OTP Code'
    }
  }

  public async resetPassword(resetPasswordDto: ResetPasswordDto, userId: string) {
    if (!validate.isMongoID(userId)) throw CustomError.badRequest('Mongo id is not valid')

    const user = await UserModel.findById(userId)
    if (!user) throw CustomError.badRequest('Invalid reset password')

    const otp = await OtpModel.findOne({userId: user.id})
    if (!otp) throw CustomError.badRequest('Invalid reset password')

    const OTPExpired = new Date() > new Date(otp.otpExpiration!)
    if (OTPExpired) throw CustomError.badRequest('OTP is Expired')

    const { password, confirmPassword } = resetPasswordDto
    if (password.localeCompare(confirmPassword) !== 0) throw CustomError.badRequest('passwords are not equal')

    try {

      user.password = Bcrypt.hash(password)
      await user.save()

      otp.otp = null
      otp.otpExpiration = null
      await otp.save()

      return {
        message: 'Reset password successful'
      }
    } catch (err) {
      console.log(err)
      throw CustomError.internalServer('Internal Server Error')
    }

  }
}
