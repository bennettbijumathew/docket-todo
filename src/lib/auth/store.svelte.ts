import { User } from "firebase/auth";
import { AuthStatus } from "@/lib/auth/type";

export class AuthStore {
    public status: AuthStatus = "loading";
    public error: string = "";
    #user: User | null = null; 

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