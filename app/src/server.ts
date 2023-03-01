import * as dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import userRouter from "./userRouter.js";

const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || "3000";

const server = express();
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000/");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  // res.header(
  //   "Access-Control-Allow-Headers",
  //   "Origin, X-Requested-With, Content-Type, Accept"
  // );
});
server.use("/user", userRouter);
server.get("/", (req: Request, res: Response) => {
  res.send("サーバー起動しています。");
});
server.listen(port, (err?: any) => {
  if (err) throw err;
  console.log(
    `> Ready on http://localhost:${port} - env ${process.env.NODE_ENV}`
  );
});
