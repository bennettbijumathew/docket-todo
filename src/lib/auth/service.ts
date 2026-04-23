import { type User } from "firebase/auth";
import { authRepo, AuthRepository } from "./repository.ts";
import { authStore, AuthDataStore } from "./store.svelte.ts";
import { AuthError } from "./type.ts";
import { isEmailValid, isPasswordValid, isUsernameValid } from "../shared/input-validation.ts";
import { toast } from "svelte-sonner";




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
        // This sets the user interface to an unready and loading state without an error.
        this.authStore.setReady(false)
        this.authStore.setLoading(true)
        this.authStore.setError("")

        try {
            const user = await this.authRepo.emailLogIn(email, password)

            if (user === null) {
                throw new AuthError("auth/user-not-found")
            }

            // Checks if email is verified, it is assumed that the user exists 
            // as code passed the last guard clause
            if (user.emailVerified === false) {
                await this.authRepo.sendVerifyEmail(user)
                throw new AuthError("verification/account-not-verified")
            }

            // Returns true, as all of the guard clauses have been passed.
            return true
        }
        catch (error) {
            // If an error is encountered, the auth error is updated. 
            if (error instanceof AuthError) {
                this.authStore.setError(error.message)
            }
            else {
                this.authStore.setError("An unknown error has been encountered.")
            }

            // Sends a small notification in the page about the error
            toast.error(this.authStore.getError() ?? "")

            // Since an error was encountered, the account creation has failed. 
            return false
        }
        finally {
            this.authStore.setReady(true)
            this.authStore.setLoading(false)
        }
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
            // These are functions that validate the given input. 
            // If any conditions fail, an AuthError is thrown, and leads to the catch section
            isEmailValid(email)
            isPasswordValid(password)
            isUsernameValid(username)
            
            // A new account is created with the email and password.
            const newUser = await this.authRepo.createNewEmailAccount(email.trim(), password.trim())

            // Sends a verification link, edits the new account's username and then a successful value is sent.
            if (newUser !== null) {
                await this.authRepo.sendVerifyEmail(newUser)
                await this.authRepo.setUsername(username, newUser)

                toast.info("To verify the email, a link has been sent to your email.")

                return true;
            }
            // Since user does not exist, the account creation has failed. 
            else {
                throw new AuthError("auth/user-not-found")
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

            // Sends a small notification in the page about the error
            toast.error(this.authStore.getError() ?? "")
                            
            // Since an error was encountered, the account creation has failed. 
            return false;
        }
    }
}

export const authController = new AuthController(authRepo, authStore)