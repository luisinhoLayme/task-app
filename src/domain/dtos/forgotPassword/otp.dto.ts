import { validate } from "../../../config"

export class OtpDto {
  private constructor(
    public otp: string
  ) {}

  static create(obj: { [ key: string ]: any }): [ string?, OtpDto? ] {
    const { otp } = obj

    if ( !otp ) return ['Missing OTP code']
    if ( typeof otp !== 'string' ) return ['OTP code has been string']

    return [ undefined, new OtpDto( otp ) ]
  }
}
