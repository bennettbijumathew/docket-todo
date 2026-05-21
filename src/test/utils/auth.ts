import { writeNewEmailAccount } from "@/lib/auth/repository"
import { deleteUser, User } from "firebase/auth";

export const testAccount = {
    email: "email@email.com",
    password: "password"
}

export async function createTestAccount(): Promise<User | null>  {
    const user = await writeNewEmailAccount(testAccount)

    if (user === null) {
        throw new Error("The created test account does not exist.")
    }

    return user;
}

export async function deleteTestAccount(user: User): Promise<void> {
    await deleteUser(user)
}