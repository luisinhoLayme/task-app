import { NextFunction, Request, Response } from "express";

export class GoogleMiddleware {

  static validateGoogleToken = async (req: Request, res: Response, next: NextFunction) => {
    const { googleToken } = req.body
    if ( !googleToken ) return res.status(401).json({ error: 'googleToken is required' })

    next()
  }
}
