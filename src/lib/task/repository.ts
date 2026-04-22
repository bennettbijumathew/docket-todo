import { db } from "@/lib/shared/firebase-config"
import { collection, query, onSnapshot, QuerySnapshot, where, doc, updateDoc, arrayRemove, DocumentReference, Query, getDoc, arrayUnion, addDoc, deleteDoc, getDocs } from "firebase/firestore";
import { type NewTaskData, Task, createTaskConverter } from "./type";
import { CalendarDateTime } from "@internationalized/date";
import { dateToTimestamp } from "@/lib/shared/date";
import { toast } from "svelte-sonner";

const taskDb: string = import.meta.env.VITE_FIRESTORE_TASK_DB;

// This returns a listeners that returns the list of tasks based on the visible planners.
export function listenForTaskChanges(visiblePlanners: string[], callbackFn: (tasks: Task[]) => void) {
    // If there is no planners, an empty array and empty function are given for the caller.
    if (visiblePlanners.length <= MIN_PLANNERS) {
        callbackFn([])
        return () => {}
    }

    // Query - Gets tasks which are related to the visible planners.
    // Converter - Converts data from Firestore to the Planner object.
    const q: Query = query(collection(db, taskDb), where("planners", "array-contains-any", visiblePlanners)).withConverter(createTaskConverter())

    // This snapshot sets the planner list while adding a visible attribute for each user 
    return onSnapshot(q, (querySnapshot: QuerySnapshot) => {
        const newTasks: Task[] = querySnapshot.docs.map((doc) => doc.data()) as Task[]
        callbackFn(newTasks) 
    })
}


// This adds a new task into the tasks collection
export async function writeNewTask({name, planners, dueDate}: NewTaskData): Promise<void> {
    try {
        // Grabs the tasks collection from Firestore and adds a new document using the converter. 
        const newTaskRef = collection(db, taskDb).withConverter(createTaskConverter());
        
        await addDoc(newTaskRef, {
            name: name,
            planners: planners,
            dueDate: dueDate            
        });
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}


// This removes a new task from the list of tasks
type deleteArgs = {
    id: string
}

export async function deleteTask({id}: deleteArgs): Promise<void> {
    try {
        // Using the task id, the document is deleted of the tasks collection. 
        const taskRef: DocumentReference = doc(db, "tasks", id)
        
        await deleteDoc(taskRef)
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}



export class TaskRepository {
    // This adds a planner from a task. 
    public async addPlannerToTask(taskId: string, plannerId: string): Promise<void> {
        // A guard clause to stop the function when there is no task id.
        if (taskId.trim() == "") {
            toast.error("The planner could not be added to the task")
            return
        }

        const plannerRef: DocumentReference = doc(db, "planners", plannerId)
        const isPlannerReal: boolean = (await getDoc(plannerRef)).exists();

        // This adds a new planner only if the planner document exists in the planners database.
        if (isPlannerReal === true) {
            const taskRef = doc(db, "tasks", taskId)

            // The "arrayUnion" function prevents duplicate ids from being added to the array.
            await updateDoc(taskRef, {
                planners: arrayUnion(plannerId)
            })
        }
    }

    // This removes a planner from a task. 
    public async removePlannerFromTask(taskId: string, plannerId: string): Promise<void> {
        // A guard clause to stop the function when there is no task id.
        if (taskId.trim() == "") {
            toast.error("The planner could not be removed from the task")
            return
        }

        const taskRef: DocumentReference = doc(db, "tasks", taskId)
        const currentTask = await getDoc(taskRef)

        // Only removes the planner from the task, if tasks exists 
        // and if there is more than 0 planners in the tasks. 
        if (currentTask.exists() && currentTask.data().planners.length - 1 > MIN_PLANNERS) {
            await updateDoc(taskRef, {
                planners: arrayRemove(plannerId)
            })
        }
    }

    
    // This changes a task's name
    public async editName(taskId: string, newName: string): Promise<void> {
        // A guard clause to stop the function when there is no task id or new name.
        if (taskId.trim() == "") {
            toast.error("The task's name could not be edited")
            return
        }
        else if (newName.trim() == "") {
            toast.error("To edit the task, the title requires a non-empty field")
            return 
        }

        // This updates the task to have a new name.
        const taskRef = doc(db, "tasks", taskId)
        
        await updateDoc(taskRef, {
            name: newName
        })
    } 

    // This changes a task's date
    public async editDate(taskId: string, newDate: CalendarDateTime): Promise<void> {
        // A guard clause to stop the function when there is no task id.
        if (taskId.trim() == "") {
            toast.error("The task's date could not be edited")
            return
        }

        // This updates the task to have a new name.
        const taskRef = doc(db, "tasks", taskId)
        
        await updateDoc(taskRef, {
            dueDate: dateToTimestamp(newDate)
        })
    } 

    // This changes a task to be complete status
    public async editComplete(taskId: string, newValue: boolean): Promise<void> {
        // A guard clause to stop the function when there is no task id.
        if (taskId.trim() == "") {
            toast.error("The task's completed status could not be edited")
            return
        }

        const taskRef = doc(db, "tasks", taskId)
        
        await updateDoc(taskRef, {
            completed: newValue
        })
    } 


    // Remove all planners from group of tasks
    public async removePlannerFromAllTasks(plannerId: string) {
        // Queries all of the tasks that has the planner in the planners array
        const q = query(collection(db, "tasks"), where("planners", "array-contains-any", [plannerId])).withConverter(createTaskConverter());
        const result = await getDocs(q);

        // Removes the planner id from the task's array
        result.docs.map((doc) => {
            this.removePlannerFromTask(doc.id, plannerId)
        })
    }
}

export const taskRepo = new TaskRepository()

// This variable is the maximum amount of planners that can be added to a task. The limit is placed as
// as there is a limit of items for Firebase's array-contains-any query.
export const MIN_PLANNERS = 0
export const MAX_PLANNERS = 10