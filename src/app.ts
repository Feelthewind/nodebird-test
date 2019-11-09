import bodyParser from "body-parser";
import express from "express";
import morgan from "morgan";
import path from "path";
import cookieParser from "cookie-parser";
import passport from "passport";

import errorHandler from "./utils/errorHandler";
import passportConfig from "./passport";
import pageRouter from "./routes/page";
import authRouter from "./routes/auth";
import postRouter from "./routes/post";
import userRouter from "./routes/user";
import jwtStrategy from "./passport/jwtStrategy";

require("../db/init");
require("dotenv").config();

const app = express()
  .set("views", path.join(__dirname, "views"))
  .set("view engine", "pug")
  .set("port", process.env.PORT || 8001)
  .use(bodyParser.json())
  .use(morgan("dev"))
  .use(express.static(path.join(__dirname, "public")))
  .use("/img", express.static(path.join(__dirname, "/../uploads")))
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use(cookieParser(process.env.COOKIE_SECRET))
  .use(passport.initialize());

passportConfig(passport);
passport.use(jwtStrategy());

app.use("/", pageRouter);
app.use("/auth", authRouter);
app.use("/post", postRouter);
app.use("/user", passport.authenticate("jwt", { session: false }), userRouter);

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (err) {
      errorHandler(err, res);
    } else {
      next();
    }
  }
);

if (process.env.NODE_ENV !== "test") {
  app.listen(app.get("port"), function() {
    console.log("Example app listening at port %s", app.get("port"));
  });
}

export default app;
