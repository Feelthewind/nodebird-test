import express from "express";
import { isLoggedIn, isNotLoggedIn } from "./middlewares";
import Post from "../models/Post";

const router = express.Router();

router.get("/profile", isLoggedIn, (req, res) => {
  res.render("profile", { title: "내 정보 - NodeBird", user: req.user });
});

router.get("/join", isNotLoggedIn, (req, res) => {
  res.render("join", {
    title: "회원가입 - NodeBird",
    user: req.user
  });
});

router.get("/", async (req, res, next) => {
  try {
    const posts = await Post.query()
      .eager("user(selectId, selectNick)", {
        selectId: builder => {
          builder.select("id");
        },
        selectNick: builder => {
          builder.select("nick");
        }
      })
      .orderBy("createdAt", "DESC");

    console.dir(posts);

    res.render("main", {
      title: "NodeBird",
      twits: posts,
      user: req.user
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

export default router;
