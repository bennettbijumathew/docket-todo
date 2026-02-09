import { db } from "@/lib/config/firebase.ts"
import { collection, query, onSnapshot, QuerySnapshot, where, orderBy, doc, updateDoc, arrayRemove } from "firebase/firestore";
import { Task } from "./type";
import dayjs from "dayjs";

export class TaskRepository {
    // This function is a listener that checks for tasks that are associated to the given planner ids. 
    // Using the callback function, the user can use the given tasks in any manner.
    public onChange(plannerIds: string[], callbackFn: (tasks: Task[]) => void) {
        // If there is no planners, an empty array and empty function are given for the caller.
        if (plannerIds.length <= 0) {
            callbackFn([])
            return () => {}
        }

        const q = query(collection(db, "tasks"), where("planners", "array-contains-any", plannerIds), orderBy("name"))
        
        // This snapshot sets the planner list while adding a visible attribute for each user 
        return onSnapshot(q, (querySnapshot: QuerySnapshot) => {
            const newTasks = querySnapshot.docs.map((doc) => ({ 
                id: doc.id,
                name: doc.data().name,
                planners: doc.data().planners,
                dueDate: dayjs.unix(doc.data().dueDate.seconds),
                completed: doc.data().completed
            }) as Task)
                        
            callbackFn(newTasks) 
        })            
    }

    // This removes a planner from a task. 
    public async removePlanner(taskId: string, plannerId: string): Promise<void> {
        const plannerRef = doc(db, "tasks", taskId)
        
        await updateDoc(plannerRef, {
            planners: arrayRemove(plannerId)
        })
    }
}

export const taskRepo = new TaskRepository()