import { Strategy, ExtractJwt } from "passport-jwt";
import { PassportStatic } from "passport";

import User from "../models/User";

export default function() {
  return new Strategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET
    },
    (jwtPayload, cb) => {
      return User.query()
        .findById(jwtPayload.id)
        .then(user => {
          return cb(null, user);
        })
        .catch(err => {
          console.error(err);
          return cb(err);
        });
    }
  );
}
