import { CustomError } from "../errors/custom.error"

export class UserEntity {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public password: string,
    public validateEmail: boolean
  ) {}

  static fromObject( obj: { [key: string]: any }): UserEntity {
    const { _id, id, name, email, password, validateEmail } = obj

    if ( !_id && id ) throw CustomError.badRequest('Missing id')
    if ( !name ) throw CustomError.badRequest('Missing name')
    if ( !email ) throw CustomError.badRequest('Missing email')
    if ( !password ) throw CustomError.badRequest('Missing password')
    if ( validateEmail === undefined ) throw CustomError.badRequest('Missing emailValidated')

    return new UserEntity(id || _id, name, email, password, validateEmail)
  }
}
