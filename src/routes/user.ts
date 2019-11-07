import express from "express";
import User from "../models/User";

import { isLoggedIn } from "./middlewares";

const router = express.Router();

router.post("/:id/follow", isLoggedIn, async (req: any, res, next) => {
  try {
    const user = await User.query().findById(req.user.id);
    if (user) {
      await user
        .$relatedQuery("followings")
        .relate(parseInt(req.params.id, 10));
      res.send("success");
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

export default router;
