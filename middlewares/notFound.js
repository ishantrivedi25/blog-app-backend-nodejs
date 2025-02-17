export const notFound = (req, res, next) => {
    res.status(404).json({
        status: "error",
        data: null,
        message: `Not Found - ${req.originalUrl}`,
    });
};
