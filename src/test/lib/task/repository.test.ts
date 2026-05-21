import { logInWithEmail, logOut } from "@/lib/auth/repository";
import { db } from "@/lib/shared/firebase-config";
import { createTaskConverter } from "@/lib/task/type";
import { createTestPlanner, deleteTestPlanners } from "@/test/utils/planners";
import { createTestTask, deleteTestTasks } from "@/test/utils/task";
import { User } from "firebase/auth";
import { collection, getDocs, query, Query, where } from "firebase/firestore";
import { SvelteSet } from "svelte/reactivity";
import { afterAll, assert, beforeAll, describe, expect, test } from "vitest";

const reference = collection(db, import.meta.env.VITE_FIRESTORE_TASK_DB)
let user: User;  
let readTaskQuery: Query
let visiblePlanners: SvelteSet<string> = new SvelteSet()
// const readTaskQuery = query(collection(db, taskDb), where("planners", "array-contains-any", visiblePlanners)).withConverter(createTaskConverter())

describe("Task - Repository ", () => {   

    beforeAll(async () => {
        const loggedInUser = await logInWithEmail({
            email: import.meta.env.VITE_ACCOUNT_TEST_A_EMAIL,
            password: import.meta.env.VITE_ACCOUNT_TEST_PASSWORD,
        })

        if (!loggedInUser) {
            throw new Error('Failed to authenticate test user')
        }

        user = loggedInUser; 
        
        for (let i = 0; i < 3; i++) {
            const testPlanner = await createTestPlanner(user.uid)

            visiblePlanners.add(testPlanner.id)
        }

        readTaskQuery = query(reference, where("planners", "array-contains-any", [...visiblePlanners])).withConverter(createTaskConverter())
    })

    afterAll(async () => {
        logOut();
        
        deleteTestTasks()
        deleteTestPlanners()
    })


    test('Creating a new planner', async () => {
        // Gets the previous length of the user's visible queries.
        let oldLength = (await getDocs(readTaskQuery)).size

        // Creates new task with the task's associated test planners.
        const testTask = await createTestTask(visiblePlanners)

        // Gets the list of tasks after task is added
        let newTaskList = (await getDocs(readTaskQuery)).docs.map((doc) => doc.data())


        // This checks if the newest task exists from the list of tasks. 
        let createdTask = newTaskList.find((item) => 
            item.name == testTask.name
        )

        // Test cases which see if the new planner is added into the list.
        let newLength = newTaskList.length
        expect(newLength, "New task has not been added to the database").toEqual(oldLength + 1)

        assert(createdTask !== undefined, "New task could not be found.")
    })

    test('Reading a list of tasks from a listener', () => {
        
    })

    test('Updating all attributes of a single planner', () => {
        
    })

    test('Deleting a planner from the list of planners', () => {
        
    })
})