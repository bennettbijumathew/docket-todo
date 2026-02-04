import { Dayjs } from "dayjs"

export interface Task { 
    id: string, 
    name: string,
    planners: string[]
    dueDate: Dayjs
}