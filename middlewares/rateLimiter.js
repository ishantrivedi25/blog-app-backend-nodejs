import rateLimit from "express-rate-limit";

const rateLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 50, // Limit each IP to 50 requests per `windowMs`
    message: "Too many requests, please try again later.",
    statusCode: 429, // HTTP status code for rate limit exceeded
    headers: true, // Include rate limit headers in the response
    // Custom error handling
    handler: (req, res, next, options) => {
        // Customize the error response
        res.status(options.statusCode).json({
            message: options.message,
            status: "error",
            data: null
        });
    },
});


export default rateLimiter;