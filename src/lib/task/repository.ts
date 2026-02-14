import { db } from "@/lib/config/firebase.ts"
import { collection, query, onSnapshot, QuerySnapshot, where, orderBy, doc, updateDoc, arrayRemove, DocumentReference, Query, getDoc, arrayUnion, addDoc, deleteDoc } from "firebase/firestore";
import { type NewTaskData, Task, taskConverter } from "./type";

export class TaskRepository {
    // This function is a listener that checks for tasks that are associated to the given planner ids. 
    // Using the callback function, the user can use the given tasks in any manner.
    public onChange(plannerIds: string[], callbackFn: (tasks: Task[]) => void) {
        // If there is no planners, an empty array and empty function are given for the caller.
        if (plannerIds.length <= 0) {
            callbackFn([])
            return () => {}
        }

        // The query gets a list of tasks that are related to the planners. It is then ordered by name and converted to the Task type.
        const q: Query = query(collection(db, "tasks"), where("planners", "array-contains-any", plannerIds), orderBy("name")).withConverter(taskConverter)
        
        // This snapshot sets the planner list while adding a visible attribute for each user 
        return onSnapshot(q, (querySnapshot: QuerySnapshot) => {
            const newTasks: Task[] = querySnapshot.docs.map((doc) => doc.data()) as Task[]
            callbackFn(newTasks) 
        })            
    }

    // This adds a new task into the tasks database
    public async createTask(newTask: NewTaskData): Promise<void> {
        // A guard clause to prevent a new task being added if there is no name
        // or planners attached to the task.
        if (newTask.name.trim() == "" || newTask.planners.length <= 0) {
            return 
        }

        // Grabs the tasks collection from Firestore and adds a new document using the converter. 
        const newTaskRef = collection(db, "tasks").withConverter(taskConverter)
                
        await addDoc(newTaskRef, {
            name: newTask.name,
            planners: newTask.planners,
            dueDate: newTask.dueDate            
        });
    }

    // This removes a new task into the tasks database
    public async deleteTask(taskId: string): Promise<void> {
        // A guard clause to stop the function when there is no task id.
        if (taskId.trim() == "") {
            return
        }

        // Using the task id, the document is deleted of the tasks collection. 
        const taskRef: DocumentReference = doc(db, "tasks", taskId)

        await deleteDoc(taskRef)
    }

    // This removes a planner from a task. 
    public async removePlannerFromTask(taskId: string, plannerId: string): Promise<void> {
        // A guard clause to stop the function when there is no task id.
        if (taskId.trim() == "") {
            return
        }

        const taskRef: DocumentReference = doc(db, "tasks", taskId)
        const currentTask = await getDoc(taskRef)

        // Only removes the planner from the task, if tasks exists 
        // and if there is more than 0 planners in the tasks. 
        if (currentTask.exists() && currentTask.data().planners.length - 1 > 0) {
            await updateDoc(taskRef, {
                planners: arrayRemove(plannerId)
            })
        }
    }

    // This adds a planner from a task. 
    public async addPlannerToTask(taskId: string, plannerId: string): Promise<void> {
        // A guard clause to stop the function when there is no task id.
        if (taskId.trim() == "") {
            return
        }

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
    public async setTaskComplete(taskId: string, newValue: boolean): Promise<void> {
        // A guard clause to stop the function when there is no task id.
        if (taskId.trim() == "") {
            return
        }

        const taskRef = doc(db, "tasks", taskId)
        
        await updateDoc(taskRef, {
            completed: newValue
        })
    } 
}

export const taskRepo = new TaskRepository()