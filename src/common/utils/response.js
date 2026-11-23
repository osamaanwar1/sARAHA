export const response = ({ res, status = 200, data, message = 'done' }) => {
    return res.status(status).json({
        message,
        data,
    });
};