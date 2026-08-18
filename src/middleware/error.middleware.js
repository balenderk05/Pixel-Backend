const errorMiddleware = (err, req, res, next) => {
    console.error(err);

    const statusCode = err.statusCode || 500;

    const response = {
        success: false,
        message: err.message || "Internal Server Error"
    };

    if (err.errors) {
        response.errors = err.errors;
    }

    res.status(statusCode).json(response);
};

export default errorMiddleware;