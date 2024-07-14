import { validate } from "../../../config"

export class EmailDto {
  private constructor(
    public email: string
  ) {}

  static create(obj: { [ key: string ]: any }): [ string?, EmailDto? ] {
    const { email } = obj

    if ( !email ) return ['Missing email']
    if ( !validate.email( email ) ) return ['Invalid Email']

    return [ undefined, new EmailDto( email ) ]
  }
}
