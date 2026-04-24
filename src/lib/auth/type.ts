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
    | "auth/invalid-credential"
    | "auth/user-disabled"
    | "auth/user-not-found"
    | "auth/wrong-password"
    | "auth/email-already-in-use"
    | "auth/weak-password"
    | "auth/too-many-requests"
    | "auth/network-request-failed"
    | "input-validation/low-username-characters"
    | "input-validation/wrong-email-format"
    | "input-validation/low-password-characters"
    | "input-validation/no-special-characters"
    | "verification/account-not-verified"
;
    

// The messages for each authentication error codes. 
export const authErrorMessages: Record<AuthErrorType, string> = {
    "auth/unknown-error": "Authentication error.",
    "auth/invalid-email": "Invalid email or password.",
    "auth/invalid-credential": "Invalid email or password.",
    "auth/user-disabled": "This account has been disabled.",
    "auth/user-not-found": "The user could not be found.",
    "auth/wrong-password": "The wrong password has been entered.", 
    "auth/email-already-in-use": "The email is already in use.", 
    "auth/weak-password": "Password is too weak.", 
    "auth/too-many-requests": "There are too many requests at this moment. Try again.",
    "auth/network-request-failed": "There has been a network failure. Try again.",
    "input-validation/low-username-characters": "Username length must be greater than 5",
    "input-validation/wrong-email-format": "Email does not match the email format. It should be formatted like 'name@example.com'.",
    "input-validation/low-password-characters": "Password has less than 8 characters. ",
    "input-validation/no-special-characters": "Password must have a special character of $, %, ^, &, *, !, #, /.",
    "verification/account-not-verified": "Your account is not verified, a link will be sent to your email",
}

export type AuthStatus = 
    | "loading"  
    | "error"
    | "unauthenticated" 
    | "authenticated" 
; 
