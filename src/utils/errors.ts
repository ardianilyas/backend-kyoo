export class AppError extends Error {
    status: number;
    details: Record<string, any>;

    constructor(message: string, status: number,  details?: Record<string, any>) {
        super(message);
        this.name = "AppError";
        this.status = status;
        this.details = details || {};
    }
}

export class NotFoundError extends AppError {
    constructor(message: string, details?: Record<string, any>) {
        super(message, 404, details);
        this.name = "NotFoundError";
    }
}

export class ConflictError extends AppError {
    constructor(message: string, details?: Record<string, any>) {
        super(message, 409, details);
        this.name = "ConflictError";
    }
}

export class UnauthorizedError extends AppError {
    constructor(message: string, details?: Record<string, any>) {
        super(message, 401, details);
        this.name = "UnauthorizedError";
    }
}

export class ForbiddenError extends AppError {
    constructor(message: string, details?: Record<string, any>) {
        super(message, 403, details);
        this.name = "ForbiddenError";
    }
}