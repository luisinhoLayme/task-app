import { validate } from "../../../config"

export class RegisterDto {
  private constructor(
    public name: string,
    public email: string,
    public password: string
  ) {}

  static create(obj: { [ key: string ]: any }): [ string?, RegisterDto? ] {
    const { name, email, password } = obj

    if ( !name && !email && !password ) ['Fiels are required']
    if ( !name ) return ['Missing name']
    if ( !email ) return ['Missing email']
    if ( !password ) return ['Missing password']
    if ( !validate.name( name ) ) return ['The name must have more than 3 letters']
    if ( !validate.email( email ) ) return ['Invalid Email']
    if ( !validate.passwordModerate( password ) ) return ['The password must include uppercase, lowercase, numbers and must be more than 8 characters long']

    return [ undefined, new RegisterDto( name, email, password ) ]
  }
}
