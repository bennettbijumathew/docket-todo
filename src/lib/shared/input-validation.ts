interface ValidationResponse {
    status: boolean
    message: string
}

export function isUsernameValid(newUsername: string): ValidationResponse {    
    let username = newUsername.trim()

    // If username is less than 5 characters, return an invalid status.
    if (username.length < 5) {
        return {
            status: false,
            message: "Username length must be greater than 5."
        }
    }

    // Once all checks have passed, a valid status is passed.
    return {
        status: true, 
        message: ""
    }
}

export function isEmailValid(newEmail: string): ValidationResponse {
    let email = newEmail.trim()

    // Returns invalid status if email pattern is not like 'name@example.com'
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        return {
            status: false, 
            message: "Email does not match the email format. It should be formatted like 'name@example.com'. "
        }
    }

    // Once all checks have passed, a valid status is passed.
    return {
        status: true, 
        message: ""
    }
}

export function isPasswordValid(newPassword: string): ValidationResponse {
    let password = newPassword.trim()

    // If password is less than 8 characters, return an invalid status.
    if (password.length < 8) {
        return {
            status: false, 
            message: "Password has less than 8 characters. '"
        }
    }

    // If the password does not have $, %, ^, &, *, !, #, /, return . 
    if (!/(?=[$%^&*!#/])/.test(password)) {
        return {
            status: false, 
            message: "Password must have a special character of $, %, ^, &, *, !, #, /. "
        }
    }

    // Once all checks have passed, a valid status is passed.
    return {
        status: true, 
        message: ""
    }
}