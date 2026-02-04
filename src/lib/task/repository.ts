import { db } from "@/lib/config/firebase.ts"
import { collection, query, onSnapshot, QuerySnapshot, where, orderBy } from "firebase/firestore";
import { Task } from "./type";
import dayjs from "dayjs";

export class TaskRepository {
    onChange(plannerIds: string[], callbackFn: (tasks: Task[]) => void) {
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
}

export const taskRepo = new TaskRepository()