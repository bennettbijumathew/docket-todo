import { AuthError } from "../auth/type"

export function isUsernameValid(newUsername: string): void {    
    let username = newUsername.trim()

    // If username is less than 5 characters, return an invalid status.
    if (username.length < 5) {
        throw new AuthError("input-validation/low-username-characters")
    }
}

export function isEmailValid(newEmail: string): void {
    let email = newEmail.trim()

    // Returns invalid status if email pattern is not like 'name@example.com'
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        throw new AuthError("input-validation/wrong-email-format")
    }
}

export function isPasswordValid(newPassword: string): void {
    let password = newPassword.trim()

    // If password is less than 8 characters, return an invalid status.
    if (password.length < 8) {
        throw new AuthError("input-validation/low-password-characters")
    }

    // If the password does not have $, %, ^, &, *, !, #, /, return . 
    if (!/(?=[$%^&*!#/])/.test(password)) {
        throw new AuthError("input-validation/no-special-characters")
    }
}