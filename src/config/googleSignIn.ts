import { OAuth2Client } from "google-auth-library";
import { envs } from "./envs";

const client = new OAuth2Client(envs.GOOGLE_CLIENT_ID)

export class GoogleAdapter {

  static async verify( token: string = '') {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: envs.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    // console.log(payload)

    return {
      name: payload?.name,
      email: payload?.email,
      sub: payload?.sub
    }
  }
}

