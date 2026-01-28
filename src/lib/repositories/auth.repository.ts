import { onAuthStateChanged, signInWithEmailAndPassword, User } from "firebase/auth";
import { auth } from "../config/firebase";

export class AuthRepository {   
    listen(cb: (user: User | null) => void) {
        return onAuthStateChanged(auth, cb)
    }
    
    async logInWithEmail(email: string, password: string): Promise<void> {
        await signInWithEmailAndPassword(auth, email, password);
    }

    async logOut(): Promise<void> {
        await auth.signOut()
    }
}