import axios from "axios";
import { envs } from "./envs";

export class FacebookAdapter {

  static auth() {
    return `https://www.facebook.com/v20.0/dialog/oauth?client_id=${envs.FACEBOOK_APP_ID}&redirect_uri=${envs.FACEBOOK_REDIRECT_UIR}&scope=email`
  }

  static async accessToken(code: string) {
    try {
      const { data } = await axios.get(`https://graph.facebook.com/v20.0/oauth/access_token?client_id=${envs.FACEBOOK_APP_ID}&client_secret=${envs.FACEBOOK_APP_SECRET}&code=${code}&redirect_uri=${envs.FACEBOOK_REDIRECT_UIR}`)

      const { access_token } = data

      const { data: profile } = await axios.get(`https://graph.facebook.com/v20.0/me?fields=name,email&access_token=${access_token}`)

      return {
        ...profile
      }
    } catch (error) {
      // console.error('Error:', error);
      throw new Error('Internal server Error')
    }
  }
}
