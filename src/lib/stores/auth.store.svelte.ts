// Purpose: 
// AuthStore is responsible for managing the state of the user. 

// Context:
// An AuthStore object is used to create an AuthController object. The AuthStore object can be used
// anywhere to update state of the User by providing a Firebase User variable. 

import { User } from "firebase/auth";

export class AuthStore {
    // If logged in, the user variable will use Firebase's "User" Type. If not, then the variable will be null.
    // The loading variable is used to represent the state between loading the account data. 
    // The ready variable is representative of if the user is ready to use. 
    public user: User | null;
    private loading: boolean;
    private ready: boolean;

    constructor() {
        this.user = $state(null);
        this.loading = $state(true);
        this.ready = $state(false);
    }

    // On receiving a new user, the store is updated with the new user.
    setUser(newUser: User | null): void {
        this.ready = false;
        this.loading = true;

        // If the user doesn't exist, the code clears the user. 
        if (newUser == null) {
            this.clearUser()
        }
        
        // Sets the user state to the new user. 
        this.user = newUser;
        this.ready = true;
        this.loading = false;
    }

    // Removes the user from the state. 
    clearUser(): void {
        this.loading = false;
        this.user = null;
        this.ready = true;
    }
}