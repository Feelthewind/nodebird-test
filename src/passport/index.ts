import { PassportStatic } from "passport";

import local from "./localStrategy";
import kakao from "./kakaoStrategy";
import User from "../models/User";

export default (passport: PassportStatic) => {
  passport.serializeUser((user: User, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.query()
      .where("id", id)
      .then(user => done(null, user))
      .catch(err => done(err));
  });

  local(passport);
  kakao(passport);
};
