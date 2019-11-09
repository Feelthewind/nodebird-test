import express, { Request, Response } from "express";
import passport from "passport";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { isNotLoggedIn, isLoggedIn } from "./middlewares";
import User from "../models/User";

const router = express.Router();

router.post("/join", isNotLoggedIn, async (req, res, next) => {
  const { email, nick, password } = req.body;
  try {
    const exUser = await User.query()
      .where("email", email)
      .first();
    if (exUser) {
      return res.redirect("/join");
    }
    const hash = await bcrypt.hash(password, 12);
    const user = await User.query().insert({ email, nick, password: hash });
    const token = jwt.sign({ id: user.id, nick: user.nick }, process.env
      .JWT_SECRET as string);

    return res.json({
      token
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.post("/login", isNotLoggedIn, (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: info.message,
        user
      });
    }

    return req.login(user, { session: false }, loginError => {
      if (loginError) {
        res.send(err);
      }

      const { id, nick } = user as User;
      const token = jwt.sign({ id, nick }, process.env.JWT_SECRET as string);
      return res.json({
        user: {
          id,
          nick
        },
        token
      });
    });
  })(req, res, next);
});

router.get("/logout", isLoggedIn, (req, res) => {
  req.logout();
  req.session ? req.session.destroy(() => {}) : null;
  res.redirect("/");
});

router.get("/kakao", passport.authenticate("kakao", { session: false }));

router.get(
  "/kakao/callback",
  passport.authenticate("kakao", { session: false }),
  (req, res) => {
    const { id, nick } = req.user as User;
    const token = jwt.sign({ id, nick }, process.env.JWT_SECRET as string);
    return res.json({
      user: {
        id,
        nick
      },
      token
    });
  }
);

export default router;
