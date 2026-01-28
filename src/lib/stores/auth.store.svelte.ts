import { User } from "firebase/auth";

export class AuthStore {
    public user: User | null;
    private ready: boolean;

    constructor() {
        this.user = $state(null);
        this.ready = $state(false);
    }

    setUser(newUser: User | null): void {
        if (newUser == null) {
            this.clearUser()
        }
        
        this.user = newUser;
        this.ready = true;
    }

    clearUser(): void {
        this.user = null;
        this.ready = false;
    }
}