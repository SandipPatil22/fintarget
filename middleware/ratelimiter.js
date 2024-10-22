import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 20, // limit each user to 20 tasks per minute
  keyGenerator: (req) => req.body.user_id, // user-based rate limit
  handler: (req, res) => {
    res.status(429).send("Rate limit exceeded, Please try after some time ");
  },
});

const perSecondLimiter = rateLimit({
  windowMs: 1000, // 1 second
  max: 1, // limit each user ID to 1 request per second
  keyGenerator: (req) => req.body.userId,
  message: "Too many requests, please try again in a second.",
});

export { limiter, perSecondLimiter };
