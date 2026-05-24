// On loading the firebase emulator, these verified accounts will exist as a part of firebase.
// These users are meant to be used in test cases outside of the /auth test folder 
const defaultPassword = "Testing123!"

export const testUserA = {
    email: "firstaccount@gmail.com", 
    password: defaultPassword
}

export const testUserB = {
    email: "secondAccount@gmail.com", 
    password: defaultPassword
}