import { User } from "firebase/auth";
import { AuthStatus } from "./type";

export class AuthStore {
    public status: AuthStatus = "loading";
    public error: string = "";
    #user: User | null = null; 

    get user() {
        if (this.#user === null) {
            return null
        }

        return { 
            id: this.#user.uid
        }
    }
}

export const auth = new AuthStore();

export class AuthDataStore {
    // If logged in, the user variable will use Firebase's "User" Type. If not, then the variable will be null.
    // The loading variable is used to represent the state between loading the account data. 
    // The ready variable is representative of if the user is ready to use. 
    // The error represents an error state, null = no error.
    private user: User | null;
    private loading: boolean;
    private loadingTimeout: ReturnType<typeof setTimeout> | null;
    private ready: boolean;
    private error: string | null

    constructor() {
        this.user = $state(null);
        this.loading = $state(true);
        this.loadingTimeout = null;
        this.ready = $state(false);
        this.error = $state(null);
    }


    // Getter function for the loading variable.
    public getLoading(): boolean {
        return this.loading
    }

    // Setter function for the loading variable.
    public setLoading(state: boolean): void {
        const delay = 900
        
        if (this.loadingTimeout) {
            clearTimeout(this.loadingTimeout);
        }

        this.loadingTimeout = setTimeout(() => {
            this.loading = state;
        }, delay);
        this.loading = state;
    }


    // Getter function for the ready variable.
    public getReady(): boolean {
        return this.ready
    }

    // Setter function for the ready variable.
    public setReady(state: boolean): void {
        this.ready = state
    }


    // Getter function for the error variable.
    public getError(): string | null {
        return this.error
    }

    // Setter function for the error variable.
    public setError(error: string | null): void {
        this.error = error
    }


    // A getter function for the user, it only exposes the necessary information.
    public getUser(): {email: string, displayName: string} | null {
        if (this.user == null) {
            return null
        }

        return {
            email: this.user.email ?? "",
            displayName: this.user.displayName ?? "",
        }
    }

    // A getter function for the user's id, returns null if there is no user.
    public getUserId(): string {
        if (this.user === null) {
            return ""
        }

        return this.user.uid
    }

    // Setter function for the user variable. 
    // On receiving a new user, the store is updated with the new user.
    public setUser(newUser: User | null): void {
        this.setReady(false)
        this.setLoading(true)

        // If the user doesn't exist, the code clears the user. 
        if (newUser == null) {
            this.clearUser()
        }
        
        // Sets the user state to the new user. 
        this.user = newUser;
        this.setReady(true)
        this.setLoading(false)
    }

    // Removes the user from the state. 
    public clearUser(): void {
        this.setLoading(false)
        this.user = null;
        this.setReady(true)
    }
}

export const authStore = new AuthDataStore()