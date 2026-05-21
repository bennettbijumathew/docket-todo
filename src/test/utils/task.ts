import { db } from "@/lib/shared/firebase-config";
import { deleteTask, writeNewTask } from "@/lib/task/repository";
import { createTaskConverter, NewTaskData, Task } from "@/lib/task/type";
import { getLocalTimeZone, Time, toCalendarDateTime, today } from "@internationalized/date";
import { collection, getDocs, query, where } from "firebase/firestore"
import { SvelteSet } from "svelte/reactivity";


const reference = collection(db, import.meta.env.VITE_FIRESTORE_TASK_DB)


// A list of test tasks that have been created. Used to help clean up test tasks
let testTasks: string[] = [];

// A utility function that is called to create a new test task for the test to use. 
export async function createTestTask(plannerIds: SvelteSet<string>): Promise<Task> {
    const newTask: NewTaskData = {
        name: `task-test-${crypto.randomUUID()}`,
        planners: plannerIds,
        dueDate: toCalendarDateTime(today(getLocalTimeZone()), new Time(0, 0))
    }

    // This creates a new task using the task repository functions
    await writeNewTask(newTask)
    
    const readTask = query(reference, where("planners", "array-contains-any", [...plannerIds])).withConverter(createTaskConverter())

    const newTaskList = (await getDocs(readTask)).docs.map((doc) => doc.data()) as Task[]
    
    // Finds the created test task. 
    const createdTask = newTaskList.find(
        (item) => item.name === newTask.name
    )
    
    if (createdTask === undefined) {
        throw new Error("The created test planner does not exist.")
    }
    
    testTasks.push(createdTask.id)    
    
    // Returns the new task for the test to use. 
    return createdTask
}

// Deletes all test planners that have been created in the test lifecycle.
export async function deleteTestTasks(): Promise<void> {
    testTasks.forEach(async (item) => {
        await deleteTask({
            id: item
        })
    })
}