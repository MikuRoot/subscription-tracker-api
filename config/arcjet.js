import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/next";
import { ARCJET_KEY } from "./env.js";

const aj = arcjet({
    key: ARCJET_KEY, // Get your site key from https://app.arcjet.com
    // Track budgets per user — replace "userId" with any stable identifier
    characteristics: ["ip.src"],
    rules: [
    // Shield protects against common web attacks e.g. SQL injection
    shield({ mode: "LIVE" }),
    // Block all automated clients — bots inflate AI costs
    detectBot({
        mode: "LIVE", // Blocks requests. Use "DRY_RUN" to log only
        allow: [], // Block all bots. See https://arcjet.com/bot-list
    }),
    // Enforce budgets to control AI costs. Adjust rates and limits as needed.
    tokenBucket({
        mode: "LIVE", // Blocks requests. Use "DRY_RUN" to log only
        refillRate: 2_000, // Refill 2,000 tokens per hour
        interval: "1h",
        capacity: 5_000, // Maximum 5,000 tokens in the bucket
    }),
],
});

export default aj;