
// الدالة الأساسية: بترمي Error وبتحط الـ status code في status
export const mainException = ({ message = 'Something went wrong', status = 500 } = {}) => {
    const error = new Error(message);
    error.status = status;
    throw error;
};

// 400: بيانات غلط أو ناقصة من العميل
export const BadRequestException = (message = 'Bad request') => {
    mainException({ message, status: 400 });
};

// 401: مش عامل login أو التوكن غلط/منتهي
export const UnauthorizedException = (message = 'Unauthorized') => {
    mainException({ message, status: 401 });
};

// 403: عامل login بس معندوش صلاحية
export const ForbiddenException = (message = 'Forbidden') => {
    mainException({ message, status: 403 });
};

// 404: العنصر مش موجود
export const NotFoundException = (message = 'Not found') => {
    mainException({ message, status: 404 });
};

// 409: تعارض، زي إيميل متسجل قبل كده
export const ConflictException = (message = 'Conflict') => {
    mainException({ message, status: 409 });
};

// 422: البيانات شكلها صح بس فشلت في الـ validation
export const UnprocessableEntityException = (message = 'Unprocessable entity') => {
    mainException({ message, status: 422 });
};

// 429: طلبات كتير في وقت قصير
export const TooManyRequestsException = (message = 'Too many requests') => {
    mainException({ message, status: 429 });
};

// 500: خطأ في السيرفر نفسه
export const InternalServerException = (message = 'Internal server error') => {
    mainException({ message, status: 500 });
};