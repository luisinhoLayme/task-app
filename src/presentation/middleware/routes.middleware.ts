import { NextFunction, Request, Response } from "express";
import { JwtAdapter } from "../../config";
import { UserModel } from "../../data/mongo";
import { UserEntity } from "../../domain/entities/user.entity";

export class RoutesMiddleware {

  static validateJWT = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.authorization
    if ( !token ) return res.status(401).json({ error: 'Token no privided' })

    try {
      const payload = await JwtAdapter.validateToken<{ id: string }>(token)
      if ( !payload ) return res.status(401).json({ error: 'Invalid Token' })

      const user = await UserModel.findById( payload.id )
      if ( !user ) return res.status(401).json({ error: 'Invalid token - user'})

      req.body.user = UserEntity.fromObject(user)

      next()
    } catch (err) {
      console.log(err)
      res.status(500).json({ error: 'Internal server error' })
    }
  }
}
