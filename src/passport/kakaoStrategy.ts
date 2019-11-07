import { Strategy } from "passport-kakao";

import User from "../models/User";
import { PassportStatic } from "passport";

export default (passport: PassportStatic) => {
  passport.use(
    new Strategy(
      {
        clientID: process.env.KAKAO_ID as string,
        callbackURL: "/auth/kakao/callback",
        clientSecret: ""
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const exUser = await User.query()
            .where("snsId", profile.id.toString())
            .where("provider", "kakao")
            .first();
          if (exUser) {
            done(null, exUser);
          } else {
            const newUser = await User.query().insert({
              email: profile._json && profile._json.kaccount_email,
              nick: profile.displayName,
              snsId: profile.id.toString(),
              provider: "kakao"
            });
            done(null, newUser);
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
