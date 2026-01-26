import { User } from "firebase/auth";

export class AuthStore {
    private user: User | null;
    private ready: boolean;

    constructor() {
        this.user = null;
        this.ready = false;
    }

    setUser(newUser: User): void {
        this.user = newUser;
        this.ready = true;
    }

    clearUser(): void {
        this.user = null;
        this.ready = false;
    }
}