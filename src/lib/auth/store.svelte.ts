import { User } from "firebase/auth";
import { AuthStatus } from "@/lib/auth/type";

export class AuthStore {
    public error: string = $state("");
    #authStatus: AuthStatus = $state("authenticated");
    #user: User | null = $state(null); 
    #loadingTimeout: ReturnType<typeof setTimeout> | null = null;

    get status() {
        return this.#authStatus;
    }

    set status(newStatus: AuthStatus) {
        this.#authStatus = newStatus;
    }

    get userId() {
        if (this.#user === null) {
            return "";
        }

        return this.#user.uid;
    }

    get user(): {id: string} | null {
        if (this.#user === null) {
            return null;
        }
        
        return { 
            id: this.#user.uid
        };
    }

    set user(newUser: User | null) {
        this.#user = newUser;
    }
}

export const authentication = new AuthStore();