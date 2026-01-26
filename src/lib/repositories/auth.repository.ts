import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";

export class AuthRepository {       
    async logInWithEmail(email: string, password: string): Promise<void> {
        await signInWithEmailAndPassword(auth, email, password);
    }

    async logOut(): Promise<void> {
        await auth.signOut()
    }
}