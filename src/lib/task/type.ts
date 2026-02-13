import { CalendarDateTime } from "@internationalized/date"

export interface Task { 
    id: string, 
    name: string,
    planners: string[]
    dueDate: CalendarDateTime
    completed: boolean
}