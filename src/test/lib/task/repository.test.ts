import { logInWithEmail, logOut } from "@/lib/auth/repository";
import { Planner } from "@/lib/planner/type";
import { db } from "@/lib/shared/firebase-config";
import { deleteTask, editComplete, editDate, editName, listenTasks } from "@/lib/task/repository";
import { updateTaskComplete, updateTaskDate, updateTaskName } from "@/lib/task/service";
import { createTaskConverter, Task } from "@/lib/task/type";
import { createTestPlanner, deleteTestPlanners } from "@/test/utils/planners";
import { createTestTask, deleteTestTasks } from "@/test/utils/task";
import { User } from "firebase/auth";
import { collection, doc, getDoc, getDocs, query, Query, where } from "firebase/firestore";
import { SvelteSet } from "svelte/reactivity";
import { afterAll, assert, beforeAll, describe, expect, test } from "vitest";

const reference = collection(db, import.meta.env.VITE_FIRESTORE_TASK_DB)
let user: User;  
let readTaskQuery: Query
let visiblePlanners: SvelteSet<string> = new SvelteSet()

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

    test('Reading a list of tasks from a listener', async () => {
        let previousTasks = []
        let currentTasks: Task[] = []

        // This creates a listeners that places the old data into an array
        // with the new data being placed in the current planners array.
        let unSubFromPlanner = listenTasks([...visiblePlanners], (newTasks) => {
            previousTasks = currentTasks

            currentTasks = newTasks
        })

        // Creates a test planner to see if the 
        await createTestPlanner(user.uid)   

        // Unsubscribes the listener so resources aren't being taken. 
        unSubFromPlanner?.()
                   
        // Runs the test scenario after a bit as updates take some time to load. 
        setTimeout(() => {            
            expect(currentTasks.length, "Listener does not update on new changes").toEqual(previousTasks.length + 1)
        }, 400)
    }, 400)

    test('Updating all attributes of a single planner', async () => {
        let oldTask = await createTestTask(visiblePlanners)

        await editName({
            id: oldTask.id, 
            name: `${oldTask.id}-update`
        })

        await editComplete({
            id: oldTask.id, 
            complete: !oldTask.completed
        })

        await editDate({
            id: oldTask.id, 
            date: oldTask.dueDate.add({days: 1})
        })

        // Gets the newest task document.
        let taskDoc = await getDoc(doc(db, import.meta.env.VITE_FIRESTORE_TASK_DB, oldTask.id).withConverter(createTaskConverter()));
        let newTask = taskDoc.data() as Task;

        // Checks if planner id has changed.
        expect(oldTask.id, "Planner after update doesn't have the same id").toEqual(newTask.id)

        // Checks if the attributes have been changed. 
        expect(oldTask.name, "Planner after update has the same name").not.toEqual(newTask.name)
        expect(oldTask.dueDate, "Planner after update has the same due date").not.toEqual(newTask.dueDate)
        expect(oldTask.completed, "Planner after update has the same complete status").not.toEqual(newTask.completed)

    })

    test('Deleting a planner from the list of planners', async () => {
        // Creates a new test task. 
        const testTask = await createTestTask(visiblePlanners)

        // Gets the previous length of the user's visible queries
        let oldLength = (await getDocs(readTaskQuery)).size

        await deleteTask({
            id: testTask.id
        })

        // Gets the list of planners after new planner is added. 
        let plannerList: Task[] = (await getDocs(readTaskQuery)).docs.map((doc) => doc.data()) as Task[]

        // This checks if the newest planner exists from the list of planners. 
        let deletedPlanner = plannerList.find((item) => 
            item.id == testTask.id
        )


        // Test cases which see if the new planner is deleted from the list.
        let newLength = plannerList.length
        expect(newLength, "New planner has not been deleted from the database").toEqual(oldLength - 1)
        expect(deletedPlanner, "New planner has not been deleted from the database").toBeUndefined()
    })
})