import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import session from "express-session";
import { google } from "googleapis";
import { addDays, startOfDay } from "date-fns";
import pkg from "date-fns-tz";
const { utcToZonedTime } = pkg;
const dev = process.env.NODE_ENV !== "production";
const router = express.Router();
router.use(session({
    secret: "secretkey",
    resave: false,
    name: "session",
    saveUninitialized: true,
}));
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use((req, res, next) => {
    // req.session.refresh_token = "";
    next();
});
const options = {
    clientId: process.env.client_id,
    clientSecret: process.env.client_secret,
    redirectUri: JSON.parse(process.env.redirect_uris ?? "")[dev ? 0 : 1],
};
router.get("/", (req, res) => {
    const oauth2Client = new google.auth.OAuth2(options);
    const scopes = [
        "https://www.googleapis.com/auth/fitness.location.read",
        "https://www.googleapis.com/auth/fitness.activity.read",
        "profile",
    ];
    const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: scopes.join(" "),
    });
    res.redirect(url);
    res.end();
});
router.get("/oauth2callback", async (req, res) => {
    // const options = {
    //   clientId: process.env.client_id,
    //   clientSecret: process.env.client_secret,
    //   redirectUri: "http://localhost:8080/user/oauth2callback",
    // };
    const oauth2Client = new google.auth.OAuth2(options);
    const code = req.query.code;
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    console.log(tokens.refresh_token);
    req.session.refresh_token = tokens.refresh_token ?? "";
    res.redirect("/user/steps");
    res.end();
});
router.get("/steps", async (req, res) => {
    console.log(req.session.refresh_token);
    if (!req.session.refresh_token) {
        return res.redirect("/user");
    }
    // const options = {
    //   clientId: process.env.client_id,
    //   clientSecret: process.env.client_secret,
    //   redirectUri: "http://localhost:8080/user/oauth2callback",
    // };
    const oauth2Client = new google.auth.OAuth2(options);
    oauth2Client.setCredentials({
        refresh_token: req.session.refresh_token,
    });
    const fitness = google.fitness({ version: "v1", auth: oauth2Client });
    const timeZone = "Asia/Tokyo";
    const targetDate = addDays(new Date(), -1);
    const zonedTargetDate = utcToZonedTime(targetDate, timeZone);
    const startTime = startOfDay(zonedTargetDate).getTime();
    const endTime = addDays(startTime, 1).getTime();
    try {
        const fitRes = await fitness.users.dataset.aggregate({
            userId: "me",
            requestBody: {
                aggregateBy: [
                    {
                        dataTypeName: "com.google.step_count.delta",
                        dataSourceId: "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps",
                    },
                ],
                bucketByTime: {
                    durationMillis: (endTime - startTime).toString(),
                },
                startTimeMillis: startTime.toString(),
                endTimeMillis: endTime.toString(),
            },
        });
        res.send(fitRes?.data?.bucket?.[0]?.dataset?.[0]?.point?.[0]?.value?.[0].intVal?.toString());
    }
    catch (err) {
        res.status(500).send({ message: "permission denieded" });
    }
});
export default router;
