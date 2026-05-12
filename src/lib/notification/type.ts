import { CalendarDateTime } from "@internationalized/date";

export interface Notif {
    id: number;
    title: string;
    body: string;
}

export type NotifWithDate = Notif & {
    dueDate: CalendarDateTime;
}

export type RemoveNotif = {
    id: number;
}

export interface Scheduler {
    push: ({ id, title, body, dueDate }: NotifWithDate) => void, 
    pop: ({ id }: RemoveNotif) => void
} 
