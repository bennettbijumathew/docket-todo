import { type User } from "firebase/auth";
import { logInWithEmail, logOut, sendVerifyEmail, updateUsername, writeNewEmailAccount } from "./repository.ts";
import { authStore } from "./store.svelte.ts";
import { AuthError } from "./type.ts";
import { isEmailValid, isPasswordValid, isUsernameValid } from "../shared/input-validation.ts";
import { toast } from "svelte-sonner";

// This function starts the user's authenticated session with the application. 
type startSessionArgs = {
    user: User
}

export function startAuthSession({user}: startSessionArgs): void {
    authStore.setUser(user);
}


// This function ends the authenticated session of the application.
export function endAuthSession(): void {
    authStore.setError(""); 

    // Removes the user from the state, This leads to the UI being updated without any user.
    authStore.clearUser(); 

    // Logs the user out from Firebase. 
    logOut(); 
}


// This function signs the user into the application ensuring the ui state is updated.
type emailSignInArgs = {
    email: string, 
    password: string
}

export async function signInWithEmail({email, password}: emailSignInArgs): Promise<boolean> {
    // This sets the user interface to an unready and loading state without an error.
    authStore.setReady(false);
    authStore.setLoading(true);
    authStore.setError("");

    try {
        // This logs the account using the repository, the auth listener updates. 
        const user = await logInWithEmail({
            email: email.trim(), 
            password: password
        });

        if (user === null) {
            throw new AuthError("auth/user-not-found");
        }

        // Checks if email is verified, it is assumed that the user exists as code passed the last guard clause
        if (user.emailVerified === false) {
            await sendVerifyEmail({
                user: user
            });

            throw new AuthError("verification/account-not-verified");
        }

        // Returns true, as all of the guard clauses have been passed.
        return true;
    }
    catch (error) {
        // If an error is encountered, the auth error is updated. 
        if (error instanceof AuthError) {
            authStore.setError(error.message);
        }
        else {
            authStore.setError("An unknown error has been encountered.");
        }

        // Sends a small notification in the page about the error
        toast.error(authStore.getError() ?? "");

        // Since an error was encountered, the account creation has failed. 
        return false;
    }
    finally {
        authStore.setReady(true);
        authStore.setLoading(false);
    }
}


// This functions logs the user out from the authentication session for the UI and Firebase
export function signOut(): void {
    authStore.setError("");

    // Removes the user from the state, This leads to the UI being updated without any user.
    authStore.clearUser();

    // Logs the user out from Firebase. 
    logOut();

    // Sends a message to the user.
    toast.success("You have signed out of your account.");
}


// This function creates a new firebase account and returns a status on if the creation is successful
type createEmailArgs = {
    username: string, 
    email: string, 
    password: string
}

export async function createEmailAccount({username, email, password}: createEmailArgs): Promise<boolean> {        
    // Resets error message before account is created.
    authStore.setError("");

    try {
        // These are functions that validate the given input. 
        // If any conditions fail, an AuthError is thrown, and leads to the catch section
        isEmailValid(email);
        isPasswordValid(password);
        isUsernameValid(username);
        
        // A new account is created with the email and password.
        const newUser = await writeNewEmailAccount({ 
            email: email.trim(), 
            password: password.trim()
        });

        // Sends a verification link, edits the new account's username and then a successful value is sent.
        if (newUser !== null) {
            await sendVerifyEmail({
                user: newUser
            });

            await updateUsername({
                user: newUser,
                username: username, 
            })

            toast.info("To verify the email, a link has been sent to your email.")
            return true;
        }
        // Since user does not exist, the account creation has failed. 
        else {
            throw new AuthError("auth/user-not-found")
        }
    }
    catch (error: any) { 
        // If an error is encountered, the auth error is updated. 
        if (error instanceof AuthError) {
            authStore.setError(error.message)
        }
        else {
            authStore.setError("An unknown error has been encountered.")
        }

        // Sends a small notification in the page about the error
        toast.error(authStore.getError() ?? "Unknown Error")
                        
        // Since an error was encountered, the account creation has failed. 
        return false;
    }
}