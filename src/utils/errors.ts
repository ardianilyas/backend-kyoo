export class NotFoundError extends Error {
    status: number;
    details: Record<string, any>;

    constructor(message: string, details?: Record<string, any>) {
        super(message);
        this.name = "NotFoundError";
        this.status = 404;
        this.details = details || {};
    }
}