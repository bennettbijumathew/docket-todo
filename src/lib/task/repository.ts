import { db } from "@/lib/shared/firebase-config"
import { collection, query, onSnapshot, QuerySnapshot, where, doc, updateDoc, arrayRemove, DocumentReference, Query, getDoc, arrayUnion, addDoc, deleteDoc, getDocs } from "firebase/firestore";
import { type NewTaskData, Task, createTaskConverter } from "./type";
import { CalendarDateTime } from "@internationalized/date";
import { dateToTimestamp } from "@/lib/shared/date";

const taskDb: string = import.meta.env.VITE_FIRESTORE_TASK_DB;
const plannerDb: string = import.meta.env.VITE_FIRESTORE_PLANNER_DB;

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
        const taskRef: DocumentReference = doc(db, taskDb, id)
        
        await deleteDoc(taskRef)
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}

// This adds a planner towards the tasks' list of associated planners
type appendPlannerArgs = {
    taskId: string
    newPlannerId: string
}

export async function appendPlannerToTask({taskId, newPlannerId}: appendPlannerArgs): Promise<void> {
    try {
        const plannerRef: DocumentReference = doc(db, plannerDb, newPlannerId);
        const isPlannerReal: boolean = (await getDoc(plannerRef)).exists();
        
        // This adds a new planner only if the planner document exists in the planners database.
        if (isPlannerReal === true) {
            const taskRef = doc(db, taskDb, taskId);
            
            // The "arrayUnion" function prevents duplicate ids from being added to the array.
            await updateDoc(taskRef, {
                planners: arrayUnion(newPlannerId)
            });
        }
    }
    catch (error) {
        console.log(error);
        throw error; 
    }
}


// This removes a planner from the tasks' list of associated planners
type detachPlannerArgs = {
    taskId: string
    oldPlannerId: string
}

export async function detachPlannerFromTask({taskId, oldPlannerId}: detachPlannerArgs): Promise<void> {
    try {
        const taskRef: DocumentReference = doc(db, taskDb, taskId)
        const currentTask = await getDoc(taskRef)
    
        // Only removes the planner from the task, if tasks exists 
        // and if there is more than 0 planners in the tasks. 
        if (currentTask.exists() && currentTask.data().planners.length - 1 > MIN_PLANNERS) {
            await updateDoc(taskRef, {
                planners: arrayRemove(oldPlannerId)
            })
        }
    }
    catch (error) {
        console.log(error);
        throw error; 
    }
}


// This updates the name of a task
type editNameArgs = {
    id: string, 
    name: string
}

export async function editName({id, name}: editNameArgs): Promise<void> {
    try {
        const taskRef = doc(db, taskDb, id)
        
        await updateDoc(taskRef, {
            name: name
        })
    }
    catch (error) {
        console.log(error);
        throw error; 
    }
}


// This updates the name of a task
type editDateArgs = {
    id: string, 
    date: CalendarDateTime
}

export async function editDate({id, date}: editDateArgs): Promise<void> {
    try {
        const taskRef = doc(db, taskDb, id)
        
        await updateDoc(taskRef, {
            dueDate: dateToTimestamp(date)
        })
    }
    catch (error) {
        console.log(error);
        throw error; 
    }
}


// This updates the name of a task
type editCompleteArgs = {
    id: string, 
    complete: boolean
}

export async function editComplete({id, complete}: editCompleteArgs): Promise<void> {
    try {
        const taskRef = doc(db, taskDb, id)
        
        await updateDoc(taskRef, {
            completed: complete
        })
    }
    catch (error) {
        console.log(error);
        throw error; 
    }
}

// This variable is the maximum amount of planners that can be added to a task. The limit is placed as
// as there is a limit of items for Firebase's array-contains-any query.
export const MIN_PLANNERS = 0
export const MAX_PLANNERS = 10