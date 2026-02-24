// Structured version of errors from the auth side of the application. 
export interface AuthError {
    code: string, 
    message: string
} 

// Using firebase authentication's error code, a message and code is given in a structured format
export const getAuthError = (error: any | null) => {
    if (error.code === null) {
        return {
            code: "auth/unknown-error",
            message: "Authentication Error"
        }
    }
    
    switch (error.code) {
        case "auth/invalid-email":
            return {
                code: error.code,
                message: "Invalid email address."
            }
        case "auth/user-disabled":
            return {
                code: error.code,
                message: "This account has been disabled."
            }
        case "auth/user-not-found":
            return {
                code: error.code,
                message: "The user could not be found."
            }
        case "auth/wrong-password":
            return {
                code: error.code,
                message: "The wrong password has been entered."
            }
        case "auth/email-already-in-use":
            return {
                code: error.code,
                message: "The email is already in use."
            }            
        case "auth/weak-password":
            return {
                code: error.code,
                message: "Password is too weak."
            }            
        case "auth/too-many-requests":
            return {
                code: error.code,
                message: "Too many attempts. Please try again later."
            }            
        case "auth/network-request-failed":
            return {
                code: error.code,
                message: "Network error. Check your connection."
            }            
        default:
            return {
                code: "auth/unknown-error",
                message: "Authentication Error"
            }
    }
}
