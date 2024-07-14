import { validate } from "../../../config"

export class ResetPasswordDto {
  private constructor(
    public password: string,
    public confirmPassword: string
  ) {}

  static create(obj: { [ key: string ]: any }): [ string?, ResetPasswordDto? ] {
    const { password, confirmPassword } = obj

    if ( !password ) return ['Missing password']
    if ( !validate.passwordModerate( password ) ) return ['The password must include uppercase, lowercase, numbers and must be more than 8 characters long']

    if ( !confirmPassword ) return ['Missing confirmPassword']

    return [ undefined, new ResetPasswordDto( password, confirmPassword ) ]
  }
}
