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
    // The unSubFromAuth is a variable that holds a function for an authentication listener.
    // The authRepo class is one that provides services from Firebase Authentication, 
    // while the authStore is a class that handles the UI state of the authentication process.
    private unSubFromAuth?: () => void
    private authRepo: AuthRepository;
    private authStore: AuthDataStore;
    
    // The controller takes in a authentication store and repository object. 
    constructor(repository: AuthRepository, store: AuthDataStore) {
        this.authRepo = repository;
        this.authStore = store;
    }

    // This function starts the authentication listener and appends it to an unsubscribe function. 
    // On changes such as a user logging in, the store will be updated appropriately. 
    start(): void {
        this.unSubFromAuth = this.authRepo.listen((user: User | null) => {
            this.authStore.setUser(user)
        })
    }

    // This function unsubscribes the Authentication listener, causing the authentication changes 
    // to no longer be tracked. 
    stop(): void {
        this.unSubFromAuth?.()
    }


    async logInWithEmail(email: string, password: string): Promise<void> {
        authStore.setLoading(true)

        try {
            await this.authRepo.emailLogIn(email, password)
        } 
        finally {
            this.authStore.setLoading(false)
        }
    }


    // This functions logs the user out from the authentication session for the UI and Firebase
    logOut(): void {
        // Removes the user from the state, This leads to the UI being updated without any user.
        this.authStore.clearUser()

        // Logs the user out from Firebase. 
        this.authRepo.logOut()
    }
}

export const authController = new AuthController(authRepo, authStore)