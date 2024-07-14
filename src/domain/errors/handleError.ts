import { Response } from "express";
import { CustomError } from "./custom.error";

export class HandleError {
  static error = ( err: unknown, res: Response ) => {
    if ( err instanceof CustomError ) {
      return res.status(err.statusCode).json({error: err.message})
    }

    console.log(`${ err }`)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

