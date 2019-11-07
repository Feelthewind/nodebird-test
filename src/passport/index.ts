import { PassportStatic } from "passport";

import local from "./localStrategy";
import kakao from "./kakaoStrategy";
import User from "../models/User";

export default (passport: PassportStatic) => {
  passport.serializeUser((user: User, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id: number, done) => {
    User.query()
      .findById(id)
      // .eager(
      //   "[followers(selectId, selectNick), followings(selectId, selectNick)]",
      //   {
      //     selectId: builder => {
      //       builder.select("id");
      //     },
      //     selectNick: builder => {
      //       builder.select("nick");
      //     }
      //   }
      // )
      .eager("[followers, followings]")
      .then(user => {
        console.dir(user);
        done(null, user);
      })
      .catch(err => {
        console.error(err);
        done(err);
      });
  });

  local(passport);
  kakao(passport);
};
