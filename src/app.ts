import bodyParser from "body-parser";
import express from "express";
import morgan from "morgan";
import path from "path";
import cookieParser from "cookie-parser";
import session from "express-session";
import flash from "connect-flash";

import errorHandler from "./utils/errorHandler";
import pageRouter from "./routes/page";

require("../db/init");
require("dotenv").config();

const app = express()
  .set("views", path.join(__dirname, "views"))
  .set("view engine", "pug")
  .set("port", process.env.PORT || 8001)
  .use(bodyParser.json())
  .use(morgan("dev"))
  .use(express.static(path.join(__dirname, "public")))
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use(cookieParser(process.env.COOKIE_SECRET))
  .use(
    session({
      resave: false,
      saveUninitialized: false,
      secret: process.env.COOKIE_SECRET as string,
      cookie: {
        httpOnly: true,
        secure: false
      }
    })
  )
  .use(flash());

app.use("/", pageRouter);

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
