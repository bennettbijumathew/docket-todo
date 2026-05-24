import { writeNewEmailAccount } from "@/lib/auth/repository"
import { auth } from "@/lib/shared/firebase-config";
import { deleteUser, User } from "firebase/auth";

export type TestAccount = {
    user: User, 
    email: string, 
    password: string
}

// This function created an unverified test account. 
export async function createTestAccount(email: string, password: string): Promise<TestAccount>  {
    const user = await writeNewEmailAccount({email, password})

    if (user === null) {
        throw new Error("The created test account does not exist.")
    }

    return { user, email, password };
}

// This function deletes the currently logged in account. 
export async function deleteTestAccount(): Promise<void> {
    if (auth.currentUser !== null) {
        await deleteUser(auth.currentUser)
    }
}