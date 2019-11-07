import passportLocal from "passport-local";
import bcrypt from "bcrypt";
import { PassportStatic } from "passport";

import User from "../models/User";

export default function(passport: PassportStatic) {
  const LocalStrategy = passportLocal.Strategy;
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password"
      },
      async (email, password, done) => {
        try {
          const exUser = await User.query()
            .where("email", email)
            .first();
          if (exUser) {
            const result = await bcrypt.compare(
              password,
              exUser.password as string
            );
            if (result) {
              done(null, exUser);
            } else {
              done(null, false, { message: "비밀번호가 일치하지 않습니다." });
            }
          } else {
            done(null, false, { message: "가입되지 않은 회원입니다." });
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
}
