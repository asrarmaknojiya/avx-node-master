export const successResponse = (res, message, data = null, meta = null, status = 200) => {
    const response = {
        success: true,
        message,
        data,
        statusCode: status
    };
    if (meta) response.meta = meta;
    return res.status(status).json(response);
};

export const errorResponse = (res, message, errors = null, status = 500) => {
    const response = {
        success: false,
        message,
        statusCode: status
    };
    if (errors) response.errors = errors;
    return res.status(status).json(response);
};

export const paginatedResponse = (res, message, data, page, limit, totalCount, status = 200) => {
    const meta = {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
    };

    return res.status(status).json({
        success: true,
        message,
        data,
        meta,
        statusCode: status
    });
};

export default {
    successResponse,
    errorResponse,
    paginatedResponse
};
