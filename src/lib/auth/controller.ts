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
    public async logInWithEmail(email: string, password: string): Promise<void> {
        // This sets the user interface to an unready and loading state.
        this.authStore.setReady(false)
        this.authStore.setLoading(true)

        try {
            // This logs the user in, issues in the log in are caught and handled.
            await this.authRepo.emailLogIn(email, password)

            // Once user is logged in, the user interface is ready and has stopped loading.
            this.authStore.setLoading(false)
            this.authStore.setReady(true)
        } 
        catch (error) {
            // If an error was caught, the user interface is stops loading and is set to not ready as user is not logged in.
            this.authStore.setLoading(false)
            this.authStore.setReady(false)
        }
    }

    // This functions logs the user out from the authentication session for the UI and Firebase
    public logOut(): void {
        // Removes the user from the state, This leads to the UI being updated without any user.
        this.authStore.clearUser()

        // Logs the user out from Firebase. 
        this.authRepo.logOut()
    }


    public async createNewAccount(email: string, password: string) {
        try {
            const newUser = await this.authRepo.createEmailAccount(email, password)
            console.log(typeof newUser.code == "string" )
        }
        catch (error) { 
            console.log(error)
        }
    }
}

export const authController = new AuthController(authRepo, authStore)