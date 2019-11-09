import { Strategy, ExtractJwt } from "passport-jwt";
import { PassportStatic } from "passport";

import User from "../models/User";

export default function(passport: PassportStatic) {
  passport.use(
    new Strategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: "your_jwt_secret"
      },
      (jwtPayload, cb) => {
        return User.query()
          .findById(jwtPayload.id)
          .then(user => {
            return cb(null, user);
          })
          .catch(err => {
            return cb(err);
          });
      }
    )
  );
}
