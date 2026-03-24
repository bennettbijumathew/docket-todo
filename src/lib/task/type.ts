import { dateToTimestamp, timestampToDate } from "@/components/util/date";
import { CalendarDateTime } from "@internationalized/date"
import { QueryDocumentSnapshot } from "firebase/firestore";
import { SvelteSet } from "svelte/reactivity";

export interface Task { 
    id: string, 
    name: string,
    planners: SvelteSet<string>
    dueDate: CalendarDateTime
    completed: boolean
}

export interface NewTaskData {
    name: string,
    planners: SvelteSet<string>,
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
            planners: new SvelteSet(data.planners),
            dueDate: timestampToDate(data.dueDate),
            completed: data.completed,
        }

        return task;
    }
})

