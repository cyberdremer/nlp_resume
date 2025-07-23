import express from "express";
import passport from "../config/passport";
import sessionConfig from "../config/session";
import logger from "../middleware/logger";
import toplevelRouter from "../routers/toplevel";
import "dotenv/config";

const app = express();
app.set("trust proxy", 1);



app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(sessionConfig);
app.use(passport.initialize());
app.use(passport.session());
app.use(logger);
app.use(toplevelRouter);
app.listen(process.env.SERVER_PORT, () => {
  console.log("Listening on port 4000");
});

export default app;
