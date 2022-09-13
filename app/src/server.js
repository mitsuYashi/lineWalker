"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _a, _b;
exports.__esModule = true;
require("dotenv/config");
// eslint-disable-next-line @typescript-eslint/no-var-requires
var express = require("express");
var app = express();
var bot_sdk_1 = require("@line/bot-sdk");
var PORT = process.env.PORT || 3000;
var config = {
    channelAccessToken: process.env.LINE_ACCESS_TOKEN,
    channelSecret: (_a = process.env.LINE_CHANNEL_SECRET) !== null && _a !== void 0 ? _a : ""
};
var clientConfig = {
    channelAccessToken: (_b = process.env.LINE_ACCESS_TOKEN) !== null && _b !== void 0 ? _b : "",
    channelSecret: process.env.LINE_CHANNEL_SECRET
};
app.get("/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, res.status(200).json({
                status: "success",
                message: "Connected successfully!"
            })];
    });
}); });
app.post("/webhook", (0, bot_sdk_1.middleware)(config), function (req, res) {
    var _a, _b;
    console.log((_a = req.body) === null || _a === void 0 ? void 0 : _a.events);
    Promise.all((_b = req.body) === null || _b === void 0 ? void 0 : _b.events.map(handleEvent)).then(function (result) {
        return res.json(result);
    });
});
var client = new bot_sdk_1.Client(clientConfig);
var handleEvent = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var msg, profile;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                msg = "";
                if (event.type !== "message" || event.message.type !== "text") {
                    return [2 /*return*/, Promise.resolve(null)];
                }
                return [4 /*yield*/, client.getProfile((_a = event.source.userId) !== null && _a !== void 0 ? _a : "")];
            case 1:
                profile = _b.sent();
                console.log(profile);
                msg = "".concat(profile.displayName, "\u3055\u3093\u3053\u3093\u306B\u3061\u306F\u3002 \u3042\u306A\u305F\u306E\u30E6\u30FC\u30B6\u30FCID\u306F").concat(profile.userId, "\u3067\u3059\u3002");
                return [2 /*return*/, client.replyMessage(event.replyToken, {
                        type: "text",
                        text: msg
                    })];
        }
    });
}); };
app.listen(PORT);
console.log("Server running at ".concat(PORT));
