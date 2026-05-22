import { collection, doc, DocumentSnapshot, getDoc, getDocs, query, Query, where } from "firebase/firestore";
import { deleteTask, editComplete, editDate, editName, listenTasks } from "@/lib/task/repository";
import { afterAll, assert, beforeAll, describe, expect, test } from "vitest";
import { createTestTask, deleteTestTasks } from "@/test/utils/task";
import { logInWithEmail, logOut } from "@/lib/auth/repository";
import { createTaskConverter, Task } from "@/lib/task/type";
import { createTestPlanner } from "@/test/utils/planners";
import { testUserB } from "@/test/utils/test-users";
import { db } from "@/lib/shared/firebase-config";
import { SvelteSet } from "svelte/reactivity";
import { User } from "firebase/auth";

let readTaskQuery: Query
let visiblePlanners: SvelteSet<string> = new SvelteSet()

describe("Task - Repository", () => {
    let testUser: User;

       
    beforeAll(async () => {        
        const loggedInUser = await logInWithEmail({
            email: testUserB.email,
            password: testUserB.password
        })

        if (!loggedInUser) {
            throw new Error('Failed to authenticate test user')
        }
        
        // On the user being logged in, user-specific planners are created. 
        testUser = loggedInUser; 
        
        for (let i = 0; i < 3; i++) {
            const testPlanner = await createTestPlanner(testUser.uid)

            visiblePlanners.add(testPlanner.id)
        }

        // Create a query to grab tasks related to the created planners
        readTaskQuery = query(
            collection(db, import.meta.env.VITE_FIRESTORE_TASK_DB), 
            where("planners", "array-contains-any", [...visiblePlanners])
        ).withConverter(createTaskConverter())
    })

    afterAll(async () => {
        logOut();
        
        deleteTestTasks()
    })


    test('Creating a new planner', async () => {
        // Gets the previous length of the user's visible queries.
        let oldLength: number = (await getDocs(readTaskQuery)).size

        // Creates new task with the task's associated test planners.
        const testTask: Task = await createTestTask(visiblePlanners)

        // Gets the list of tasks after task is added
        let newTaskList: Task[] = (await getDocs(readTaskQuery)).docs.map((doc) => doc.data() as Task)


        // This checks if the newest task exists from the list of tasks. 
        let createdTask: Task | undefined = newTaskList.find((item) => 
            item.name == testTask.name
        )


        // Test cases which see if the new planner is added into the list.
        let newLength: number = newTaskList.length
        expect(newLength, "New task has not been added to the database").toEqual(oldLength + 1)

        assert(createdTask !== undefined, "New task could not be found.")
    })

    test('Reading a list of tasks from a listener', async () => {
        let previousTasks: Task[] = []
        let currentTasks: Task[] = []

        // This creates a listeners that places the old data into an array
        // with the new data being placed in the current planners array.
        let unSubFromPlanner = listenTasks([...visiblePlanners], (newTasks) => {
            previousTasks = currentTasks

            currentTasks = newTasks
        })

        // Creates a test planner to see if the 
        await createTestPlanner(testUser.uid)   

        // Unsubscribes the listener so resources aren't being taken. 
        unSubFromPlanner?.()
                   
        // Runs the test scenario after a bit as updates take some time to load. 
        setTimeout(() => {            
            expect(currentTasks.length, "Listener does not update on new changes").toEqual(previousTasks.length + 1)
        }, 400)
    }, 400)

    test('Updating all attributes of a single task', async () => {
        let oldTask: Task = await createTestTask(visiblePlanners)

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
        let taskDoc: DocumentSnapshot = await getDoc(doc(db, import.meta.env.VITE_FIRESTORE_TASK_DB, oldTask.id).withConverter(createTaskConverter()));
        let newTask: Task = taskDoc.data() as Task;


        // Checks if task id has changed.
        expect(oldTask.id, "Planner after update doesn't have the same id").toEqual(newTask.id)

        // Checks if the attributes have been changed. 
        expect(oldTask.name, "Planner after update has the same name").not.toEqual(newTask.name)
        expect(oldTask.dueDate, "Planner after update has the same due date").not.toEqual(newTask.dueDate)
        expect(oldTask.completed, "Planner after update has the same complete status").not.toEqual(newTask.completed)
    })

    test('Deleting a task from the list of tasks', async () => {
        // Creates a new test task. 
        const testTask: Task = await createTestTask(visiblePlanners)

        // Gets the previous length of the user's visible queries
        let oldLength: number = (await getDocs(readTaskQuery)).size

        await deleteTask({
            id: testTask.id
        })

        // Gets the list of planners after new planner is added. 
        let taskList: Task[] = (await getDocs(readTaskQuery)).docs.map((doc) => doc.data()) as Task[]

        // This checks if the newest planner exists from the list of planners. 
        let deletedTask: Task | undefined = taskList.find((item) => 
            item.id == testTask.id
        )


        // Test cases which see if the new planner is deleted from the list.
        let newLength = taskList.length
        expect(newLength, "New planner has not been deleted from the database").toEqual(oldLength - 1)
        expect(deletedTask, "New planner has not been deleted from the database").toBeUndefined()
    })
})