import { db } from "@/lib/config/firebase.ts"
import { collection, query, onSnapshot, QuerySnapshot, where } from "firebase/firestore";
import { Task } from "./type";

export class TaskRepository {
    onChange(plannerIds: string[], callbackFn: (tasks: Task[]) => void) {
        const q = query(collection(db, "tasks"), where("planners", "array-contains-any", plannerIds))
        
        // This snapshot sets the planner list while adding a visible attribute for each user 
        return onSnapshot(q, (querySnapshot: QuerySnapshot) => {
            const newTasks = querySnapshot.docs.map((doc) => ({ 
                id: doc.id,
                name: doc.data().name,
                planners: doc.data().planners
            }) as Task)
            
            callbackFn(newTasks) 
        })            
    }
}

export const taskRepo = new TaskRepository()