// Purpose: 
// AuthRepository handles the connection from the code to the Firebase Authentication service.

// Context:
// An AuthStore object is used to create an AuthController object. The AuthRepository object can be used
// anywhere to handle account management such as sign in and sign out.  

import { createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, signInWithEmailAndPassword, updateProfile, User, } from "firebase/auth";
import { auth } from "../shared/firebase-config";
import { AuthError, AuthErrorType } from "./type";
import { FirebaseError } from "firebase/app";

export class AuthRepository {
    // This function takes a function and returns Firebase's onAuthStateChanged 
    // listener that listens on the user's account state.
    public listen(callbackFn: (user: User | null) => void) {
        return onAuthStateChanged(auth, callbackFn)
    }
    
    // A wrapper function to sign in using an Email account.
    public async emailLogIn(email: string, password: string): Promise<User | null> {
        // Returns a new user once the account has been logged in.
        try {
            const userCredentials = await signInWithEmailAndPassword(auth, email, password);
            return userCredentials.user;
        }
        // If a firebase error is caught, an auth error is thrown, if not, a default error is thrown.
        catch (error: any) {
            if (error instanceof FirebaseError) {
                throw new AuthError(error.code as AuthErrorType, error);
            }

            else {
                throw error;
            }
        }
    }

    // A wrapper function to sign out with all types of accounts.
    public async logOut(): Promise<void> {
        await auth.signOut()
    }


    // A function that creates an email account.
    public async createNewEmailAccount(email: string, password: string): Promise<User | null> {
        // Returns a new user once the account is created.
        try {
            const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
            return userCredentials.user;
        }
        // If a firebase error is caught, an auth error is thrown, if not, a default error is thrown.
        catch (error: any) {
            if (error instanceof FirebaseError) {
                throw new AuthError(error.code as AuthErrorType, error);
            }

            else {
                throw error;
            }
        }
    }


    // This function sends a verification email for a given user.
    public async sendVerifyEmail(user: User | null): Promise<void> {
        try {
            // If no user is given, then an error is thrown.
            if (user == null) { 
                throw new AuthError("auth/unknown-error")
            }
            // If user is available, a link is sent to the users' email. The user
            // will then receive an email from Firebase for verifying.
            else {
                await sendEmailVerification(user)
            }
        }
        catch (error) {
            // If an error is encountered, the auth error is updated. 
            if (error instanceof FirebaseError) {
                throw new AuthError(error.code as AuthErrorType, error)
            }
            else {
                throw error
            }
        }
    }


    // This sets a username for an account.
    public async setUsername(username: string, user: User): Promise<void>{
        // Updates the display name for the account.
        try {
            updateProfile(user, {
                displayName: username
            })
        }
        // If a firebase error is caught, an error code and message is returned
        catch(error: any) {
            if (error instanceof FirebaseError) {
                throw new AuthError(error.code as AuthErrorType, error)
            }
            else {
                throw error
            }
        }
    }
}

export const authRepo = new AuthRepository()