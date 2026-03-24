import { dateToTimestamp, timestampToDate } from "@/components/util/date";
import { CalendarDateTime } from "@internationalized/date"
import { QueryDocumentSnapshot } from "firebase/firestore";

export interface Task { 
    id: string, 
    name: string,
    planners: Set<string>
    dueDate: CalendarDateTime
    completed: boolean
}

export interface NewTaskData {
    name: string,
    planners: Set<string>,
    dueDate: CalendarDateTime
} 

export const createTaskConverter = () => ({
    toFirestore: (task: NewTaskData) => {
        return {
            name: task.name,
            planners: [...task.planners],
            dueDate: dateToTimestamp(task.dueDate),
            completed: false
        };
    },

    fromFirestore: (snapshot: QueryDocumentSnapshot) => {
        const data = snapshot.data();
        
        const task: Task = {
            id: snapshot.id,
            name: data.name,
            planners: new Set(data.planners),
            dueDate: timestampToDate(data.dueDate),
            completed: data.completed,
        }

        return task;
    }
})

