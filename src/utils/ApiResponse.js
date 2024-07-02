const successResponse = (res, data, message) => {
    return res.status(200).json({
        success: true,
        message,
        data,
    });
};

const errorResponse = (res, message, statusCode = 500) => {
    return res.status(statusCode).json({
        success: false,
        message,
    });
}

export { successResponse, errorResponse };