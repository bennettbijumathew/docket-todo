import { ErrorBase } from "../shared/errors";

// AuthError is a authentication related error that uses the ErrorBase as a template.
// ErrorBase ensures a consistent behavior across all errors  
export class AuthError extends ErrorBase<AuthErrorType> {
    constructor(name: AuthErrorType, cause?: unknown) {
        super(name, authErrorMessages, cause); 
    }
}

// This is a list of error types that are correlated to firebase authentication.
export type AuthErrorType = 
    | "auth/unknown-error"
    | "auth/invalid-email"
    | "auth/user-disabled"
    | "auth/user-not-found"
    | "auth/wrong-password"
    | "auth/email-already-in-use"
    | "auth/weak-password"
    | "auth/too-many-requests"
    | "auth/network-request-failed";

// The messages for each authentication error codes. 
export const authErrorMessages: Record<AuthErrorType, string> = {
    "auth/unknown-error": "Authentication error.",
    "auth/invalid-email": "Invalid email address.",
    "auth/user-disabled": "This account has been disabled.",
    "auth/user-not-found": "The user could not be found.",
    "auth/wrong-password": "The wrong password has been entered.", 
    "auth/email-already-in-use": "The email is already in use.", 
    "auth/weak-password": "Password is too weak.", 
    "auth/too-many-requests": "There are too many requests at this moment. Try again.",
    "auth/network-request-failed": "There has been a network failure. Try again."
}