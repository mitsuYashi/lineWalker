import "dotenv/config";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const express = require("express");
const app = express();
import {
  Client,
  ClientConfig,
  middleware,
  MiddlewareConfig,
  WebhookEvent,
} from "@line/bot-sdk";
import { Request, Response } from "express";
const PORT = process.env.PORT || 3000;

const config: MiddlewareConfig = {
  channelAccessToken: process.env.LINE_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET ?? "",
};

const clientConfig: ClientConfig = {
  channelAccessToken: process.env.LINE_ACCESS_TOKEN ?? "",
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

app.get("/", async (req: Request, res: Response): Promise<Response> => {
  return res.status(200).json({
    status: "success",
    message: "Connected successfully!",
  });
});
app.post("/webhook", middleware(config), (req: Request, res: Response) => {
  console.log(req.body?.events);
  Promise.all(req.body?.events.map(handleEvent)).then((result) =>
    res.json(result)
  );
});

const client = new Client(clientConfig);

const handleEvent = async (event: WebhookEvent) => {
  let msg = ``;

  if (event.type !== "message" || event.message.type !== "text") {
    return Promise.resolve(null);
  }

  const profile = await client.getProfile(event.source.userId ?? "");
  console.log(profile);
  msg = `${profile.displayName}さんこんにちは。 あなたのユーザーIDは${profile.userId}です。`;

  return client.replyMessage(event.replyToken, {
    type: "text",
    text: msg,
  });
};

app.listen(PORT);
console.log(`Server running at ${PORT}`);
