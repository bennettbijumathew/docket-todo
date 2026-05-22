import { listenAuth, logInWithEmail, logOut, updateUsername } from "@/lib/auth/repository";
import { createTestAccount, deleteTestAccount, TestAccount } from "@/test/utils/auth";
import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { auth } from "@/lib/shared/firebase-config";
import { User } from "firebase/auth";

describe("Auth - Repository", () => {
    let testUser: TestAccount;
    
    // Creates a test account for the test to use.
    beforeAll(async () => {
        testUser = await createTestAccount(`${crypto.randomUUID()}@test.com`, 'password')
    })
    
    // Deletes the test after test is completed.
    afterAll(async () => {
        await deleteTestAccount()
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

        await logInWithEmail({
            email: testUser.email, 
            password: testUser.password
        })


        // Unsubscribes the listener, preventing memory leaks. 
        unSubFromAuth?.()

        setTimeout(() => {     
            expect(user, "Listener does not update on new authentication changes").toBeDefined()
        }, 400)
    })

    test("Logging into an account", async () => {
        const loggedInUser: User | null = await logInWithEmail({
            email: testUser.email, 
            password: testUser.password
        })


        expect(loggedInUser, "User has not been logged in").toBeDefined()
        expect(loggedInUser?.uid, "Account User ID has not been identified").toEqual(auth.currentUser?.uid)
        expect(loggedInUser?.email, "Email Account has not been identified").toEqual(auth.currentUser?.email)
        expect(loggedInUser?.emailVerified, "Email verification state has not been identified").toEqual(auth.currentUser?.emailVerified)
        expect(loggedInUser?.displayName, "Display name has not been identified").toEqual(auth.currentUser?.displayName)
    })

    test("Logging out of the account", async () => {
        // Logs into an account.
        const loggedInUser: User | null = await logInWithEmail({
            email: testUser.email, 
            password: testUser.password
        })

        expect(loggedInUser, "User has not been logged in in log out test case").toBeDefined()
        
        // Logs out of the account.
        await logOut()

        setTimeout(() => {     
            expect(auth.currentUser, "Current user has not been logged out").toBeNull()
        }, 400)
    })

    test("Creating a new email account", async () => {
        const loggedInUser: User | null = await logInWithEmail({
            email: testUser.email, 
            password: testUser.password
        })

        expect(loggedInUser, "User has not been logged into new account").toBeDefined()
    })

    test("Updating attributes of the account", async () => {
        const oldUser: User | null = await logInWithEmail({
            email: testUser.email, 
            password: testUser.password
        })

        let oldUsername; 

        if (oldUser !== null) {
            oldUsername = oldUser.displayName

            updateUsername({
                user: oldUser,
                username: crypto.randomUUID(), 
            })
        }
        else {
            throw new Error("Cannot update email attribute as account doesn't exist")
        }
        
        const newUser: User | null = await logInWithEmail({
            email: testUser.email, 
            password: testUser.password
        })


        if (newUser !== null) {        
            expect(oldUsername).not.toEqual(newUser.displayName)
        }
        else {
            throw new Error("Cannot update email attribute as account doesn't exist")
        }
    })
})