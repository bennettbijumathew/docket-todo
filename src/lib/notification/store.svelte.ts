import {
    CalendarDateTime,
    getLocalTimeZone,
    toCalendarDateTime,
    today,
    now
} from "@internationalized/date";

import { cancel, isPermissionGranted, requestPermission, Schedule, sendNotification } from "@tauri-apps/plugin-notification";
import { SvelteMap } from "svelte/reactivity";
import { app } from "@/lib/app/main";
import { formatLongDate } from "../shared/date";
import { Task } from "../task/type";

type Notification = {
    id: number;
    title: string;
    body: string;
    date: CalendarDateTime;
};

type pushArgs = {
    index: string;
    title: string;
    body: string;
    dueDate: CalendarDateTime;
}

type popArgs = {
    index: string
}

class NotificationStore {
    // The 'tauri-plugin-notification' uses a number identifier, map with string index 
    // and number id is used to identify notifications related to tasks that use a string id.
    idList: SvelteMap<string, number> = new SvelteMap<string, number>();

    // A hash function to create a hash id from a given string. 
    // Used to identify notifications by number. 
    private createNotifId(id: string): number {
        let hash = 0;

        for (let i = 0; i < id.length; i++) {
            const char = id.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash |= 0;
        }

        return hash;
    }


    // Adds a new notification into the id + index map and sends notification the android device. 
    private async push({ index, title, body, dueDate }: pushArgs): Promise<void> {   
        // If the string index does not exist, a new entry is added to ensure that the 
        // correct notification is being edited.
        if (!this.idList.has(index)) {
            this.idList.set(index, this.createNotifId(index))
        }

        // Using the id, the notification is created or replaced if the same id has already been used
        // in a previous sendNotification() call. 
        sendNotification({
            id: this.idList.get(index),
            title: title,
            body: body,
            schedule: Schedule.at(dueDate.toDate(getLocalTimeZone()))
        })
    }

    // Removes a notification from the list of notifications. 
    private pop({index}: popArgs): void {
        if (!this.idList.has(index)) {
            return;     
        }

        let notifId = this.idList.get(index)

        if (notifId != undefined) {
            cancel([notifId])
        }
    }


    // This functions pushes the task's due date as notifications.
    syncTasks(newTasks: Task[]): void {
        const currentDay = toCalendarDateTime(today(getLocalTimeZone()), now(getLocalTimeZone()))
        
        // Pushes notifications based on if it is due within the next day from today.
        newTasks.map((task: Task) => {
            if (task.dueDate >= currentDay && task.dueDate <= currentDay.add({days: 1})) {
                this.push({
                    index: task.id, 
                    title: `DUE: ${task.name}`, 
                    body: `The task is due on the ${formatLongDate(task.dueDate)}.`,
                    dueDate: task.dueDate
                })
            }
            else {
                this.pop({
                    index: task.id
                })
            }
        })
    }
}


export const notifications = new NotificationStore();