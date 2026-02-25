// A class that extends the Error class, this throws an altered errors. This uses a generic types
// to ensure that extended instances of this class can create custom errors that behave in the same way.
export class ErrorBase <T extends string> extends Error {
    name: T;
    message: string
    cause?: unknown

    // This class takes a name 
    constructor(name: T, messages: Record<T, string>, cause?: unknown) {
        super(); 

        this.name = name
        this.message = messages[name] 
        this.cause = cause
    }
}