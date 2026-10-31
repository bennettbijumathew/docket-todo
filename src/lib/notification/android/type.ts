import { CalendarDateTime } from "@internationalized/date";

export interface Notif {
    id: number;
    title: string;
    body: string;
    dueDate: CalendarDateTime;
}

export type RemoveNotif = {
    id: number;
}