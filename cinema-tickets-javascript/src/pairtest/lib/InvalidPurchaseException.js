export default class InvalidPurchaseException extends Error {
    constructor(message, statusCode = 400, errorCode = 'INVALID_PURCHASE') {
        // Call the parent class (Error) constructor with the message
        super(message);

        // Maintain the name of the class as the error name
        this.name = this.constructor.name; // 'InvalidPurchaseException'

        // Assign a status code (400 by default for a bad request)
        this.statusCode = statusCode;

        // Assign a custom error code to differentiate error types
        this.errorCode = errorCode;

        // Capture stack trace for debugging (optional)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }

    // Additional method to get the status code if needed
    getStatusCode() {
        return this.statusCode;
    }

    // Method to get the error code if needed
    getErrorCode() {
        return this.errorCode;
    }
}
