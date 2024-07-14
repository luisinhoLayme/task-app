import { Bcrypt, FacebookAdapter, GoogleAdapter, JwtAdapter, envs } from "../../config";
import { TaskModel, UserModel } from "../../data/mongo";
import { CustomError, LoginDto, RegisterDto } from "../../domain";
import { UserEntity } from "../../domain/entities/user.entity";
import axios from 'axios'

export class AuthService {

  private async getToken<T>(id: string): Promise<T> {
    const token = await JwtAdapter.generateToken({ id })
    if (!token) throw CustomError.internalServer('Error while creating JWT')

    const refreshToken = await JwtAdapter.generateToken({ id }, '1d')
    if (!refreshToken) throw CustomError.internalServer('Error while creating JWT-refresh')

    return {
      token,
      refreshToken
    } as T
  }

  public async loginUser(loginDto: LoginDto) {
    const user = await UserModel.findOne({ email: loginDto.email })
    if (!user) throw CustomError.badRequest('Email or Password is not valid')

    const isMacth = Bcrypt.compare(loginDto.password, user.password)
    if (!isMacth) throw CustomError.badRequest('Email or Password is not valid')

    const { password, ...userEntity } = UserEntity.fromObject(user)

    const { token, refreshToken } = await this.getToken<{ token: string, refreshToken: string }>(user.id)

    return {
      user: userEntity,
      token,
      refreshToken
    }
  }

  public async registerUser(registerDto: RegisterDto) {
    const existsUser = await UserModel.findOne({ email: registerDto.email })
    if (existsUser) throw CustomError.badRequest('Email already exists')

    try {
      const user = new UserModel(registerDto)
      user.password = Bcrypt.hash(registerDto.password)

      await user.save()

      const task = new TaskModel({ user: user.id })
      await task.save()

      const { password, ...userEntity } = UserEntity.fromObject(user)

      const { token, refreshToken } = await this.getToken<{ token: string, refreshToken: string }>(user.id)

      return {
        user: userEntity,
        token,
        refreshToken
      }

    } catch (err) {
      throw CustomError.internalServer(`Internal Server Error`)
    }
  }

  public async googleSignIn(tokenGoogle: string) {
    try {
      const { name, email, sub } = await GoogleAdapter.verify(tokenGoogle)

      let user = await UserModel.findOne({ email: email })

      if (!user) {
        const data = {
          name,
          email,
          password: ':('
        }
        user = new UserModel(data)
        await user.save()

        const task = new TaskModel({ user: user.id })
        await task.save()
      }

      const { password, ...userEntity } = UserEntity.fromObject(user)

      const { token, refreshToken } = await this.getToken<{ token: string, refreshToken: string }>(user.id)

      return {
        user: { ...userEntity, sub },
        token,
        refreshToken
      }
    } catch (err) {
      console.log(err)
      throw CustomError.internalServer('Internal server error - Google token not verify')
    }
  }

  public async facebookUser() {
    const url = FacebookAdapter.auth()

    return {
      url
    }
  }

  public async facebookUserCallback(code: string) {
    try {
      const { name, email } = await FacebookAdapter.accessToken( code )

      let user = await UserModel.findOne({ email: email })

      if (!user) {
        const data = {
          name,
          email,
          password: ':('
        }
        user = new UserModel(data)
        await user.save()

        const task = new TaskModel({ user: user.id })
        await task.save()
      }

      const { password, ...userEntity } = UserEntity.fromObject(user)

      const { token, refreshToken } = await this.getToken<{ token: string, refreshToken: string }>(user.id)

      return {
        user: { ...userEntity },
        token,
        refreshToken
      }
    } catch (err) {
      // console.log(err)
      throw CustomError.internalServer('Internal Server Error - facebook sign in')
    }
  }

  public async refreshTokenUser(refreshToken: string = '') {
    if (!refreshToken) throw CustomError.anauthorized('Access Denied. No refresh token privided')

    const decoded = await JwtAdapter.validateToken<{ id: string }>(refreshToken)
    if (!decoded) throw CustomError.anauthorized('Token refresh not valid')

    const user = await UserModel.findById(decoded.id)
    if( !user ) throw CustomError.badRequest('User Not exists - refreshToken')

    const { token } = await this.getToken<{ token: string, refreshToken: string }>(decoded.id)

    const { password, ...userEntity } = UserEntity.fromObject(user)

    return {
      user: { ...userEntity },
      token
    }
  }

  public async validateEmail() {
    return {
      msg: 'Validate Email'
    }
  }
}
