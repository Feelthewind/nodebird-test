import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import Post from "../models/Post";
import User from "../models/User";
import Hashtag from "../models/Hashtag";
import { isLoggedIn } from "./middlewares";

const router = express.Router();
fs.readdir("uploads", error => {
  if (error) {
    console.error("uploads 폴더가 없어 uploads 폴더를 생성합니다.");
    fs.mkdirSync("uploads");
  }
});

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, "uploads/");
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(
        null,
        path.basename(file.originalname, ext) + new Date().valueOf() + ext
      );
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024 }
});
router.post("/img", isLoggedIn, upload.single("img"), (req, res) => {
  console.log(req.file);
  res.json({ url: `/img/${req.file.filename}` });
});

const upload2 = multer();
router.post("/", isLoggedIn, upload2.none(), async (req, res, next) => {
  try {
    const post = await Post.query().insert({
      content: req.body.content,
      img: req.body.url,
      userId: (req.user as User).id
    });
    const hashtags: string[] = req.body.content.match(/#[^\s]*/g);
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map(async tag => {
          const normalized = tag.slice(1).toLowerCase();
          const fetched = await Hashtag.query().where("title", normalized);
          if (fetched.length === 0) {
            return await Hashtag.query().insert({ title: normalized });
          }
        })
      );
      await Promise.all(
        result.map(async h => {
          await post.$relatedQuery("hashtags").relate((h as any).id);
        })
      );
    }
    res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/hashtag", async (req, res, next) => {
  const query = req.query.hashtag;
  if (!query) {
    return res.redirect("/");
  }
  try {
    const hashtag = await Hashtag.query()
      .where({ title: query })
      .eager("posts.user.followings")
      .first();

    return res.render("main", {
      title: `${query} | NodeBird`,
      user: req.user,
      twits: hashtag ? hashtag.posts : []
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

export default router;
