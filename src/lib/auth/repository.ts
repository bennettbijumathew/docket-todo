// Purpose: 
// AuthRepository handles the connection from the code to the Firebase Authentication service.

// Context:
// An AuthStore object is used to create an AuthController object. The AuthRepository object can be used
// anywhere to handle account management such as sign in and sign out.  

import { onAuthStateChanged, signInWithEmailAndPassword, User } from "firebase/auth";
import { auth } from "../config/firebase";

export class AuthRepository {
    // This function takes a function and returns Firebase's onAuthStateChanged 
    // listener that listens on the user's account state.
    listen(callbackFn: (user: User | null) => void) {
        return onAuthStateChanged(auth, callbackFn)
    }
    
    // A wrapper function to sign in using an Email account.
    async emailLogIn(email: string, password: string): Promise<void> {
        await signInWithEmailAndPassword(auth, email, password);
    }

    // A wrapper function to sign out with all types of accounts.
    async logOut(): Promise<void> {
        await auth.signOut()
    }
}

export const authRepo = new AuthRepository()