import { db } from "@/lib/config/firebase.ts"
import { collection, query, onSnapshot, QuerySnapshot, where, orderBy, doc, updateDoc, arrayRemove, DocumentReference, Query, getDoc, arrayUnion, setDoc, addDoc } from "firebase/firestore";
import { type NewTaskData, Task, taskConverter } from "./type";
import { CalendarDateTime } from "@internationalized/date";

export class TaskRepository {
    // This function is a listener that checks for tasks that are associated to the given planner ids. 
    // Using the callback function, the user can use the given tasks in any manner.
    public onChange(plannerIds: string[], callbackFn: (tasks: Task[]) => void) {
        // If there is no planners, an empty array and empty function are given for the caller.
        if (plannerIds.length <= 0) {
            callbackFn([])
            return () => {}
        }

        const q: Query = query(collection(db, "tasks"), where("planners", "array-contains-any", plannerIds), orderBy("name")).withConverter(taskConverter)
        
        // This snapshot sets the planner list while adding a visible attribute for each user 
        return onSnapshot(q, (querySnapshot: QuerySnapshot) => {
            const newTasks: Task[] = querySnapshot.docs.map((doc) => doc.data()) as Task[]
                        
            callbackFn(newTasks) 
        })            
    }

    // This adds a new task into the tasks database
    public async createTask(newTask: NewTaskData): Promise<void> {
        const newTaskRef = collection(db, "tasks").withConverter(taskConverter)
        
        await addDoc(newTaskRef, {
            name: newTask.name,
            planners: newTask.planners,
            dueDate: newTask.dueDate            
        });
    }

    // This removes a planner from a task. 
    public async removePlannerFromTask(taskId: string, plannerId: string): Promise<void> {
        const taskRef: DocumentReference = doc(db, "tasks", taskId)
        
        await updateDoc(taskRef, {
            planners: arrayRemove(plannerId)
        })
    }

    // This adds a planner from a task. 
    public async addPlannerToTask(taskId: string, plannerId: string): Promise<void> {
        const plannerRef: DocumentReference = doc(db, "planners", plannerId)
        const isPlannerReal: boolean = (await getDoc(plannerRef)).exists();

        // This adds a new planner only if the planner document exists in the planners database.
        if (isPlannerReal === true) {
            const taskRef = doc(db, "tasks", taskId)
            
            await updateDoc(taskRef, {
                planners: arrayUnion(plannerId)
            })
        }
    }

    // This changes a task to be complete status
    public async toggleTaskComplete(taskId: string, newValue: boolean): Promise<void> {
        const taskRef = doc(db, "tasks", taskId)
        
        await updateDoc(taskRef, {
            completed: newValue
        })
    } 
}

export const taskRepo = new TaskRepository()