// Purpose: 
// AuthRepository handles the connection from the code to the Firebase Authentication service.

// Context:
// An AuthStore object is used to create an AuthController object. The AuthRepository object can be used
// anywhere to handle account management such as sign in and sign out.  

import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, updateProfile, User, type UserCredential } from "firebase/auth";
import { auth } from "../config/firebase";
import { getAuthError, type AuthError } from "./type";
import { AppError } from "../shared/errors";

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

    // A function that creates an email account.
    public async createEmailAccount(email: string, password: string): Promise<User | AuthError> {
        // Returns a new user once the account is created.
        try {
            await createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
                return userCredential.user;
            })
        }
        // If an error is caught, an error code and message is returned
        catch (error) {
            console.log(new AppError("not really", "that is not good", error))
            console.log(error instanceof Error ? error.message : "Unknown error")

            throw new Error(error)
            return getAuthError(error)
        }

        return getAuthError(null)
    }

    public async setUsername(username: string, user: User) {
        try {
            updateProfile(user, {
                displayName: username
            })
        }
        catch(error) {
            console.log(error)
        }
    }
}

export const authRepo = new AuthRepository()