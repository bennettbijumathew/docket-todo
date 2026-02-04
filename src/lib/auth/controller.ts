// Purpose: 
// AuthController is responsible for managing authentication using a
// Svelte store class (AuthStore) and a repository class (AuthRepository) that has 
// access to Firebase Authentication Functions.

// Context:
// An AuthController object is only initialized in a root layout. The authentication
// session is handled using start() and stop() and these functions handles 
// the AuthStore and AuthRepository objects.

import { User } from "firebase/auth";
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

    // This function clears the current user.
    public stop(): void {
        this.authStore.clearUser();
    }

    // This function logs the user into the application.
    public async logInWithEmail(email: string, password: string): Promise<void> {
        authStore.setLoading(true)

        try {
            await this.authRepo.emailLogIn(email, password)
        } 
        finally {
            this.authStore.setLoading(false)
        }
    }

    // This functions logs the user out from the authentication session for the UI and Firebase
    public logOut(): void {
        // Removes the user from the state, This leads to the UI being updated without any user.
        this.authStore.clearUser()

        // Logs the user out from Firebase. 
        this.authRepo.logOut()
    }
}

export const authController = new AuthController(authRepo, authStore)