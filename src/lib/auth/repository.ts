// Purpose: 
// AuthRepository handles the connection from the code to the Firebase Authentication service.

// Context:
// An AuthStore object is used to create an AuthController object. The AuthRepository object can be used
// anywhere to handle account management such as sign in and sign out.  

import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, User, type UserCredential } from "firebase/auth";
import { auth } from "../config/firebase";
import { getAuthError, type AuthError } from "./type";

export class AuthRepository {
    // This function takes a function and returns Firebase's onAuthStateChanged 
    // listener that listens on the user's account state.
    public listen(callbackFn: (user: User | null) => void) {
        return onAuthStateChanged(auth, callbackFn)
    }
    
    // A wrapper function to sign in using an Email account.
    public async emailLogIn(email: string, password: string): Promise<void> {
        await signInWithEmailAndPassword(auth, email, password);
    }

    // A wrapper function to sign out with all types of accounts.
    public async logOut(): Promise<void> {
        await auth.signOut()
    }

    public async createAccount(email: string, password: string): Promise<UserCredential | AuthError> {
        try {
            await createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
                return userCredential.user;
            })
        }
        catch (error) {
            return getAuthError(error)
        }

        return getAuthError(null)
    }
}

export const authRepo = new AuthRepository()