import { createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, signInWithEmailAndPassword, updateProfile, User, } from "firebase/auth";
import { auth } from "../shared/firebase-config";
import { AuthError, AuthErrorType } from "./type";
import { FirebaseError } from "firebase/app";


// Returns a listener that uses a callback function to listen on the user's auth state.
export function listenForAuthChanges(callbackFn: (user: User | null) => void) {
    return onAuthStateChanged(auth, callbackFn)
}
    

// Function to log into an email account.
type emailLogInArgs = {
    email: string,
    password: string
}

export async function logInWithEmail({email, password}: emailLogInArgs): Promise<User | null> {
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


// A function to sign out of Firebase.
export async function logOut(): Promise<void> {
    try {
        await auth.signOut()
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


// A function that creates an email account.
type createEmailArgs = {
    email: string,
    password: string
}

export async function writeNewEmailAccount({email, password}: createEmailArgs): Promise<User | null> {
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
type verifyArgs = {
    user: User | null
}

export async function sendVerifyEmail({user}: verifyArgs): Promise<void> {
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
type updateUsernameArgs = {
    username: string
    user: User
}

export async function updateUsername({username, user}: updateUsernameArgs): Promise<void>{
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