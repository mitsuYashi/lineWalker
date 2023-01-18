import express from "express";
// import { createServer } from "http";
// import { bodyParser } from "body-parser";
import userRouter from "./userRouter.js";
const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || "3000";
const server = express();
server.use("/user", userRouter);
server.get("/", (req, res) => {
    res.send("サーバー起動しています。");
});
server.listen(port, (err) => {
    if (err)
        throw err;
    console.log(`> Ready on http://localhost:${port} - env ${process.env.NODE_ENV}`);
});
