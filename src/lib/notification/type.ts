import { CalendarDateTime } from "@internationalized/date";

export interface WindowsNotif {
    id: number;
    title: string;
    body: string;
}

export type AndroidNotif = WindowsNotif & {
    dueDate: CalendarDateTime
}
