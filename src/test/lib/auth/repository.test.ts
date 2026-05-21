import { listenAuth, logInWithEmail, logOut, updateUsername } from "@/lib/auth/repository";
import { createTestAccount, deleteTestAccount, testAccount } from "@/test/utils/auth";
import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { auth } from "@/lib/shared/firebase-config";
import { User } from "firebase/auth";

describe("Auth - Repository", () => {
    // Creates a test account for the test to use.
    beforeAll(async () => {
        await createTestAccount()
    })
    
    // Deletes the test after test is completed.
    afterAll(async () => {
        if (auth.currentUser !== null) {
            await deleteTestAccount(auth.currentUser)
        }
    })

    
    test("Reading authentication state from auth listener", async () => {
        let user: User | null = null; 
        
        let unSubFromAuth = listenAuth((newUser) => {
            if (newUser === null) {
                user = null
            }
            else {
                user = newUser
            }
        })

        await logInWithEmail(testAccount)

        // Unsubscribes the listener, preventing memory leaks. 
        unSubFromAuth?.()

        setTimeout(() => {     
            expect(user, "Listener does not update on new authentication changes").toBeDefined()
        }, 400)
    })

    test("Logging into an account", async () => {
        const user = await logInWithEmail(testAccount)

        expect(user, "User has not been logged in").toBeDefined()
        expect(user?.uid, "Account User ID has not been identified").toEqual(auth.currentUser?.uid)
        expect(user?.email, "Email Account has not been identified").toEqual(auth.currentUser?.email)
        expect(user?.emailVerified, "Email verification state has not been identified").toEqual(auth.currentUser?.emailVerified)
        expect(user?.displayName, "Display name has not been identified").toEqual(auth.currentUser?.displayName)
    })

    test("Logging out of the account", async () => {
        // Logs into an account.
        const user: User | null = await logInWithEmail(testAccount)

        expect(user, "User has not been logged in").toBeDefined()
        
        // Logs out of the account.
        await logOut()

        setTimeout(() => {     
            expect(auth.currentUser, "Current user has not been logged out").toBeNull()
        }, 400)
    })

    test("Creating a new email account", async () => {
        // Logs into the email using the account created in the before test function.
        const user = await logInWithEmail(testAccount)

        expect(user, "User has not been logged in").toBeDefined()
    })

    test("Updating attributes of the account", async () => {
        const oldUser = await logInWithEmail(testAccount)
        let oldUsername; 

        if (oldUser !== null) {
            oldUsername = oldUser.displayName

            updateUsername({
                user: oldUser,
                username: `${oldUser.displayName}-update`, 
            })
        }
        else {
            throw new Error("Cannot update email attribute as account doesn't exist")
        }
        
        const newUser = await logInWithEmail(testAccount)

        if (newUser !== null) {        
            console.log(oldUsername)    
            console.log(newUser.displayName)    

            expect(oldUsername).not.toEqual(newUser.displayName)
        }
        else {
            throw new Error("Cannot update email attribute as account doesn't exist")
        }
    })
})