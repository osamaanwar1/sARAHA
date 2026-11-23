
export function errorHandler(err, req, res, next) {
    console.log("ERR:", err.name, "|", err.path, "|", err.value, "|", err.message)

    if (res.headersSent) {
        return next(err);
    }

    let status = Number.isInteger(err.status) ? err.status : 500;
    let message = err.message || "Internal Server Error";
    let errors;

    // 1. Mongoose Validation Error
    if (err.name === "ValidationError") {
        status = 400;
        message = "Validation failed";

        errors = Object.values(err.errors).map(e => ({
            field: e.path,
            message: e.message
        }));
    }

    // 2. Mongoose Cast Error
    else if (err.name === "CastError") {
        status = 400;
        message = "Invalid ID or value";
    }

    // 3. MongoDB Duplicate Key Error
    else if (err.code === 11000) {
        status = 409;
        message = "Value already exists";

        errors = Object.keys(err.keyValue || {}).map(field => ({
            field,
            message: `${field} already exists`
        }));
    }

    // 4. Mongoose Document Not Found Error
    else if (err.name === "DocumentNotFoundError") {
        status = 404;
        message = "Document not found";
    }

    // 5. Invalid JSON Error
    else if (err.type === "entity.parse.failed") {
        status = 400;
        message = "Invalid JSON body";
    }

    // Log unexpected server errors
    if (status >= 500) {
        console.error(err);
    }

    res.status(status).json({
        success: false,
        message,
        ...(errors && { errors })
    });
}
