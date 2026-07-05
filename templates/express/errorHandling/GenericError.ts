export class GenericError extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }

    getCode(): number {
        if (this instanceof BadRequest) return 400;
        if (this instanceof NotFound) return 404;
        return 500;
    }
}

export class BadRequest extends GenericError {}
export class NotFound extends GenericError {}
