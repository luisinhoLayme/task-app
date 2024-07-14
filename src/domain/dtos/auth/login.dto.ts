export class LoginDto {
  private constructor(
    public email: string,
    public password: string
  ) {}

  static create(obj: { [ key: string ]: any }): [ string?, LoginDto? ] {
    const { email, password } = obj

    if ( !email && !password ) ['Fiels are required']
    if ( !email ) return ['Missing email']
    if ( !password ) return ['Missing password']

    return [ undefined, new LoginDto( email, password ) ]
  }
}
