import { CookieOptions, Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { HandleError, LoginDto, RegisterDto } from "../../domain";
import { envs } from "../../config";
import axios from "axios";

export class AuthController {
  private optionAuth: CookieOptions = { httpOnly: true, sameSite: 'strict', maxAge: 2000 * 60 * 60 }
  private optionRefresh: CookieOptions = { httpOnly: true, sameSite: 'strict' }

  constructor(
    public readonly authService: AuthService
  ) { }

  public loginUser = (req: Request, res: Response) => {
    const [error, loginDto] = LoginDto.create(req.body)
    if (error) return res.status(400).json({ error })

    this.authService.loginUser(loginDto!)
      .then(({ user, token, refreshToken }) => res
        .cookie('authorization', token, this.optionAuth)
        .cookie('refreshToken', refreshToken, this.optionRefresh)
        .json(user)
      )
      .catch(error => HandleError.error(error, res))
  }

  public registerUser = (req: Request, res: Response) => {
    const [error, registerDto] = RegisterDto.create(req.body)
    if (error) return res.status(400).json({ error })

    this.authService.registerUser(registerDto!)
      .then(({ user, token, refreshToken }) => res
        .cookie('authorization', token, this.optionAuth)
        .cookie('refreshToken', refreshToken, this.optionRefresh)
        .json(user)
      )
      .catch(error => HandleError.error(error, res))
  }

  public googleSignIn = (req: Request, res: Response) => {
    const { googleToken } = req.body

    this.authService.googleSignIn(googleToken)
      .then(({ user, token, refreshToken }) => res
        .cookie('authorization', token, this.optionAuth)
        .cookie('refreshToken', refreshToken, this.optionRefresh)
        .json(user)
      )
      .catch(error => HandleError.error(error, res))
  }

  public refreshTokenUser = (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken
    console.log(req.body.user)

    this.authService.refreshTokenUser(refreshToken)
      .then(({ user, token }) => res
        .cookie('authorization', token, this.optionAuth)
        .json({ user: user, refresh_token: 'Successful.' })
      )
      .catch(error => HandleError.error(error, res))
  }

  public validateEmail = (req: Request, res: Response) => {
    res.json("validateEmail")
  }

  public logout = (req: Request, res: Response) => {
    res
      .clearCookie('authorization')
      .clearCookie('refreshToken')
      .json({ msg: "Logout successful." })
      .end()
  }
}