import { CalendarDateTime } from "@internationalized/date"
import { QueryDocumentSnapshot } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";

export interface Task { 
    id: string, 
    name: string,
    planners: string[]
    dueDate: CalendarDateTime
    completed: boolean
}

export interface NewTaskData {
    name: string,
    planners: string[],
    dueDate: CalendarDateTime
} 

export const createTaskConverter = () => ({
    toFirestore: (task: NewTaskData) => {
        const date = new Date(
            task.dueDate.year,
            task.dueDate.month - 1,
            task.dueDate.day,
            task.dueDate.hour,
            task.dueDate.minute,
            task.dueDate.second,
        );

        return {
            name: task.name,
            planners: task.planners,
            dueDate: Timestamp.fromDate(date),
            completed: false
        };
    },

    fromFirestore: (snapshot: QueryDocumentSnapshot) => {
        const data = snapshot.data();
        const unconvertedDate = data.dueDate.toDate();
        
        const convertedDate = new CalendarDateTime(
            unconvertedDate.getFullYear(),
            unconvertedDate.getMonth() + 1,
            unconvertedDate.getDate(),
            unconvertedDate.getHours(),
            unconvertedDate.getMinutes(),
            unconvertedDate.getSeconds()
        );

        const task: Task = {
            id: snapshot.id,
            name: data.name,
            planners: data.planners,
            dueDate: convertedDate,
            completed: data.completed,
        }

        return task;
    }
})

