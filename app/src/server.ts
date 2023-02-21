import * as dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import userRouter from "./userRouter.js";

const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || "3000";

const server = express();
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
