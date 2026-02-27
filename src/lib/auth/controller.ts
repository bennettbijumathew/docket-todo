// Purpose: 
// AuthController is responsible for managing authentication using a
// Svelte store class (AuthStore) and a repository class (AuthRepository) that has 
// access to Firebase Authentication Functions.

// Context:
// An AuthController object is only initialized in a root layout. The authentication
// session is handled using start() and stop() and these functions handles 
// the AuthStore and AuthRepository objects.

import { type User } from "firebase/auth";
import { authRepo, AuthRepository } from "./repository.ts";
import { authStore, AuthDataStore } from "./store.svelte";
import { AuthError } from "./type.ts";
import { isEmailValid, isPasswordValid, isUsernameValid } from "../shared/input-validation.ts";

export class AuthController {
    // The authRepo class is one that provides services from Firebase Authentication, 
    // while the authStore is a class that handles the UI state of the authentication process.
    private authRepo: AuthRepository;
    private authStore: AuthDataStore;
    
    // The controller takes in a authentication store and repository object. 
    constructor(repository: AuthRepository, store: AuthDataStore) {
        this.authRepo = repository;
        this.authStore = store;
    }

    // This function takes a returns the auth state listener from the Firebase repository.
    public listenForAuth(callbackFn: (user: User | null) => void) {
        return this.authRepo.listen(callbackFn)
    }

    // This function starts a session with a new Firebase user.
    public start(user: User): void {
        this.authStore.setUser(user);
    }

    // This function logs the user out.
    public stop(): void {
        this.logOut()
    }


    // This function logs the user into the application.
    public async logInWithEmail(email: string, password: string): Promise<boolean> {
        // This is a variable to determine if the login is successful.
        let isSuccessful: boolean = false

        // This sets the user interface to an unready and loading state without an error.
        this.authStore.setReady(false)
        this.authStore.setLoading(true)
        this.authStore.setError("")

        try {
            // This logs the user in, issues in the log in are caught and handled.
            const user = await this.authRepo.emailLogIn(email, password)

            // Runs once the user is logged in with a verified account, 
            if (user !== null && user.emailVerified === true) {
                // Sets user interface to be ready.
                this.authStore.setLoading(false)
                this.authStore.setReady(true)
                
                // Sets successful state to true as user has been logged in and verified.
                isSuccessful = true 
            }
            else {
                // This sets the user in an unready state as account is not logged in.
                this.authStore.setLoading(true)
                this.authStore.setReady(false)
                
                // If user doesn't exist, an unknown error is given.
                if (user === null) {
                    this.authStore.setError("An unknown error has been encountered. Try to log in or create a new account. ")
                }

                // If user exists but email doesn't exist, an error is given while sending a verification email.
                if (user !== null && user.emailVerified === false) {
                    this.authStore.setError("Your account has not been verified. A link will be sent to your email. ")
                    await this.authRepo.sendVerifyEmail(user)
                }

                // Sets successful state to false as user is not logged in or verified.
                isSuccessful = false
            }
        } 
        catch (error) {
            // If an error is encountered, the auth error is updated. 
            if (error instanceof AuthError) {
                this.authStore.setError(error.message)
            }
            else {
                this.authStore.setError("An unknown error has been encountered.")
            }

            // Since an error was encountered, the account creation has failed. 
            isSuccessful = false
        }

        // Returns the current success state of the user's log in.
        return isSuccessful
    }

    // This functions logs the user out from the authentication session for the UI and Firebase
    public logOut(): void {
        // Resets error message before account is created.
        this.authStore.setError("")

        // Removes the user from the state, This leads to the UI being updated without any user.
        this.authStore.clearUser()

        // Logs the user out from Firebase. 
        this.authRepo.logOut()
    }


    // This function creates a new firebase account and returns a status on if the creation is successful
    public async createEmailAccount(username: string, email: string, password: string): Promise<boolean> {        
        // Resets error message before account is created.
        this.authStore.setError("")

        try {
            // Validation the inputs before account is created. If inputs are not valid, then a unsuccessful status is sent.
            if (isUsernameValid(username).status == false) {
                this.authStore.setError(isUsernameValid(username).message)
                
                return false;
            }
            else if (isEmailValid(email).status == false) {
                this.authStore.setError(isEmailValid(email).message)

                return false;
            }
            else if (isPasswordValid(password).status == true) {
                this.authStore.setError(isPasswordValid(password).message)

                return false;
            }
            
            // A new account is created with the email and password.
            const newUser = await this.authRepo.createNewEmailAccount(email.trim(), password.trim())

            // Sends a verification link, edits the new account's username and then a successful value is sent.
            if (newUser !== null) {
                await this.authRepo.sendVerifyEmail(newUser)
                await this.authRepo.setUsername(username, newUser)

                return true;
            }
            // Since user does not exist, the account creation has failed. 
            else {
                return false;
            }
        }
        catch (error: any) { 
            // If an error is encountered, the auth error is updated. 
            if (error instanceof AuthError) {
                this.authStore.setError(error.message)
            }
            else {
                this.authStore.setError("An unknown error has been encountered.")
            }

            // Since an error was encountered, the account creation has failed. 
            return false;
        }
    }
}

export const authController = new AuthController(authRepo, authStore)