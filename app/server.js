require("dotenv").config();
const express = require("express");
const app = express();
const line = require("@line/bot-sdk");
const PORT = process.env.PORT || 3000;

const config = {
  channelAccessToken: process.env.LINE_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

// console.log(process.env.LINE_CHANNEL_SECRET);

app.get("/", (req, res) => res.send("Hello LINE BOT!(GET)")); //ブラウザ確認用(無くても問題ない)
app.post("/webhook", line.middleware(config), (req, res) => {
  console.log(req.body.events);
  Promise.all(req.body.events.map(handleEvent)).then((result) =>
    res.json(result)
  );
});

const client = new line.Client(config);

async function handleEvent(event) {
  let msg = ``;

  if (event.type !== "message" || event.message.type !== "text") {
    return Promise.resolve(null);
  }

  const profile = await client.getProfile(event.source.userId);
  console.log(profile);
  msg = `${profile.displayName}さんこんにちは。 あなたのユーザーIDは${profile.userId}です。`;

  return client.replyMessage(event.replyToken, {
    type: "text",
    text: msg,
  });
}

app.listen(PORT);
console.log(`Server running at ${PORT}`);
